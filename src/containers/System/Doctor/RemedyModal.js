import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";
import "./RemedyModal.scss";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import moment from "moment";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
    };
  }

  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      this.setState({
        imgBase64: base64,
      });
    }
  };
  handleOnchangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };
  render() {
    let { isOpenRemedyModal, closeRemedyModal } = this.props;

    return (
      <Modal
        isOpen={isOpenRemedyModal}
        className={"booking-modal-container"}
        size="lg"
        centered
        // backdrop={true}
      >
        <div className="modal-header">
          <h5 className="modal-title">Gửi thông tin khám bệnh thành công </h5>
          <button type="button" className="close" onClick={closeRemedyModal}>
            x
          </button>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>Email</label>
              <input
                className="form-control"
                value={this.state.email}
                onChange={(event) => this.handleOnchangeEmail(event)}
              ></input>
            </div>
            <div className="col-6 form-group">
              <label>Chọn file đơn thuốc</label>
              <input
                className="form-control-file"
                type="file"
                onChange={(event) => this.handleOnchangeImage(event)}
              ></input>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => this.handleSendRemedy()}>
            Send
          </Button>
          <Button color="secondary" onClick={closeRemedyModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // redux
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
