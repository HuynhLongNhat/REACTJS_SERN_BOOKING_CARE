import React, { Component } from "react";
import { connect } from "react-redux";
//chuyển đổi ngôn ngữ
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import "./OutStandingDoctor.scss"
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctor: [],
    };
  }
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctor: this.props.topDoctorsRedux,
      });
    }
  }
  componentDidMount() {
    this.props.loadTopDocTor();



  }
  handleViewDetailDoctor = (doctor) => {

    this.props.history.push(`/detail-doctor/${doctor.id}`);
  };
  render() {
    let arrDoctors = this.state.arrDoctor;
    console.log(' data outStanding doctor', arrDoctors)

    let { language } = this.props;
    // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);

    return (
      <div className="section section-out-standing-doctor header">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-doctor" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-inf" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  let imageBase64 = "";

                  if (item.image) {
                    imageBase64 = new Buffer(item.image, "base64").toString(
                      "binary"
                    );
                  }
                  let nameVi = `${item.positionData.valueVi} , ${item.lastName} ${item.firstName} `;
                  let nameEn = `${item.positionData.valueEn} , ${item.firstName}  ${item.lastName}`;
                  return (
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailDoctor(item)}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-out-standing-doctor"
                            style={{
                              backgroundImage: `url(${imageBase64})`,
                            }}
                          ></div>
                        </div>
                        <div className="position text-center">
                          <div className="title-name">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    topDoctorsRedux: state.admin.topDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //fire event
    loadTopDocTor: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
