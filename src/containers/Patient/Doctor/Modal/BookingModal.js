import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookingAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";
class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      genders: "",
      doctorId: "",
      timeType: "",
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.props.getGenders();
  }
  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataScheduleTimeModal !== prevProps.dataScheduleTimeModal) {
      if (
        this.props.dataScheduleTimeModal &&
        !_.isEmpty(this.props.dataScheduleTimeModal)
      ) {
        let doctorId = this.props.dataScheduleTimeModal.doctorId;
        let timeType = this.props.dataScheduleTimeModal.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }
  toggle = () => {
    this.props.handleClickScheduleTime();
  };

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({
      selectedGender: selectedOption,
    });
  };

  buildTimeBooking = (dataScheduleTimeModal) => {
    let { language } = this.props;

    if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
      let time =
        language === LANGUAGES.VI
          ? dataScheduleTimeModal.timeTypeData.valueVi
          : dataScheduleTimeModal.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment
              .unix(+dataScheduleTimeModal.date / 1000)
              .format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataScheduleTimeModal.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return `    ${time} - ${date}`;
    }
    return "";
  };

  buildDoctorName = (dataScheduleTimeModal) => {
    let { language } = this.props;

    if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataScheduleTimeModal.doctorData.lastName} ${dataScheduleTimeModal.doctorData.firstName}`
          : `${dataScheduleTimeModal.doctorData.firstName} ${dataScheduleTimeModal.doctorData.lastName}`;
      return name;
    }
    return "";
  };

  handleConfirmBooking = async () => {
    // validate input
    //!data.email || !data.doctorId || !data.timeType || !data.date
    this.setState({
      isShowLoading: true,
    });
    let date = new Date(this.state.birthday).getTime();
    let timeString = this.buildTimeBooking(this.props.dataScheduleTimeModal);
    let doctorName = this.buildDoctorName(this.props.dataScheduleTimeModal);
    let res = await postPatientBookingAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: this.props.dataScheduleTimeModal.date,
      birthday: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });
    this.setState({
      isShowLoading: false,
    });
    if (res && res.errCode === 0) {
      toast.success("Booking a new appointment succeed!");
      this.toggle();
    } else {
      toast.error("Booking a new appointment error!");
    }
  };
  render() {
    let { isOpenModalBooking, dataScheduleTimeModal } = this.props;
    let doctorId = "";
    if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
      doctorId = dataScheduleTimeModal.doctorId;
    }

    return (
      <LoadingOverlay
        active={this.state.isShowLoading}
        spinner
        text="Loading..."
      >
        <Modal
          isOpen={isOpenModalBooking}
          toggle={() => this.toggle()}
          className={"booking-modal-container"}
          size="lg"
          centered
          // backdrop={true}
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="left">
                <FormattedMessage id="patient.booking-modal.title" />
              </span>
              <span className="right" onClick={() => this.toggle()}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="booking-modal-body">
              {/* {JSON.stringify(dataScheduleTimeModal)}
            
            */}
              <div className="doctor-infor">
                <ProfileDoctor
                  doctorId={doctorId}
                  isShowDescription={false}
                  dataScheduleTimeModal={dataScheduleTimeModal}
                  isShowLinkDetail={false}
                  isShowPrice={true}
                />
              </div>

              <div className="row">
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id="patient.booking-modal.fullName" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.fullName}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "fullName")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id="patient.booking-modal.phoneNumber" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "phoneNumber")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id="patient.booking-modal.email" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.email}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "email")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id="patient.booking-modal.address" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "address")
                    }
                  ></input>
                </div>
                <div className="col-12 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id="patient.booking-modal.reason" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.reason}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "reason")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id="patient.booking-modal.birthday" />
                  </label>
                  <DatePicker
                    onChange={this.handleOnchangeDatePicker}
                    className="form-control"
                    value={this.state.birthday}
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id="patient.booking-modal.gender" />
                  </label>
                  <Select
                    value={this.state.selectedGender}
                    onChange={this.handleChangeSelect}
                    options={this.state.genders}
                  />
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <button
                className="btn-booking-confirm"
                onClick={() => this.handleConfirmBooking()}
              >
                <FormattedMessage id="patient.booking-modal.btnConfirm" />
              </button>
              <button
                className="btn-booking-cancel"
                onClick={() => this.toggle()}
              >
                <FormattedMessage id="patient.booking-modal.cancel" />
              </button>
            </div>
          </div>
        </Modal>
      </LoadingOverlay>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // redux
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
