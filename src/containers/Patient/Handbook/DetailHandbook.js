import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";

import {
    getDetailHandbookById,

} from "../../../services/userService";

import _ from "lodash";
import { LANGUAGES } from "../../../utils";
class Detailhandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailHandbook: {},

        };
    }

    async componentDidMount() {
        let res;
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;

            res = await getDetailHandbookById(id);

        }

        if (res && res.errCode === 0) {
            this.setState({
                detailHandbook: res.data ? res.data : [],
            });
        }
    }

    render() {
        let { detailHandbook } = this.state;
        let { language } = this.props;
        let imageBase64 = "";
        if (detailHandbook.image) {
            imageBase64 = new Buffer(detailHandbook.image, "base64").toString("binary");
        }
        return (
            <div className="detail-handbook">
                <HomeHeader />
                <div className="detail-handbook-body">
                    <div className="intro-handbook">
                        <div
                            className="content-left"
                            style={{
                                backgroundImage: `url(${imageBase64})`,
                            }}
                        ></div>
                        <div className="content-right">
                            <div className="up">
                                <span>{detailHandbook.name}</span>
                            </div>
                            <div className="down">



                            </div>
                        </div>
                    </div>
                    <div className="description-handbook">
                        {detailHandbook && !_.isEmpty(detailHandbook) && (
                            <>
                                {/* <div>{detailHandbook.name}</div> */}

                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: detailHandbook.descriptionHTML,
                                    }}
                                ></div>
                            </>
                        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Detailhandbook);
