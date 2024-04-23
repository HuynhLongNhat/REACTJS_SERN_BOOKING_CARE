import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "./ManageHandBook.scss";
import { CommonUtils } from "../../../utils";
import { createNewHandbook } from "../../../services/userService";
import { toast } from "react-toastify";
class ManageHandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageBase64: "",
            descriptionHTML: "",
            descriptionMarkdown: "",
        };
    }

    async componentDidMount() { }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
        }
    }

    handleOnchangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
    };
    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSaveNewHandBook = async () => {
        let res = await createNewHandbook(this.state);
        if (res && res.errCode === 0) {
            toast.success("Add new handbook success!");
            this.setState({
                name: "",
                imageBase64: "",
                descriptionHTML: "",
                descriptionMarkdown: "",
            });
        } else {
            toast.error("Something wrong....");
        }
    };

    render() {
        const mdParser = new MarkdownIt(/* Markdown-it options */);
        return (
            <div className="manage-handbook-container">
                <div className="ms-title">Quản lí cẩm nang</div>

                <div className="add-new-handbook row">
                    <div className="col-6 form-group">
                        <label>Tên cẩm nang</label>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnchangeInput(event, "name")}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh cẩm nang</label>
                        <input
                            className="form-control-file"
                            type="file"
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: "380px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            className="btn-save-handbook"
                            onClick={() => this.handleSaveNewHandBook()}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandBook);
