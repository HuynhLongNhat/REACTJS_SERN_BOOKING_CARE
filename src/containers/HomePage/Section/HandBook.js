
import React, { Component } from "react";
import { connect } from "react-redux";
//chuyển đổi ngôn ngữ
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import "./HandBook.scss";
import { getAllHandbook } from "../../../services/userService"
class HandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrHandbook: [],
    };
  }

  async componentDidMount() {

    let res = await getAllHandbook();

    if (res && res.errCode === 0) {
      this.setState({
        arrHandbook: res.data ? res.data : [],
      });
    }

  }
  handleViewDetailHandbook = (handbook) => {

    this.props.history.push(`/detail-handbook/${handbook.id}`);
  };
  render() {
    let arrHandbook = this.state.arrHandbook;
    let { language } = this.props;
    // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);

    return (
      <div className="section section-out-standing-doctor header-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              Cẩm nang
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-inf" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrHandbook &&
                arrHandbook.length > 0 &&
                arrHandbook.map((item, index) => {

                  // let nameVi = `${item.positionData.valueVi} , ${item.lastName} ${item.firstName} `;
                  // let nameEn = `${item.positionData.valueEn} , ${item.firstName}  ${item.lastName}`;
                  return (
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailHandbook(item)}
                    >
                      <div className="">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-handbook handbook-image"
                            style={{
                              backgroundImage: `url(${item.image})`,
                            }}
                          ></div>
                        </div>
                        <div className="position text-center">
                          <div className="handbook-name">{item.name}</div>
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

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //fire event

  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HandBook)
);
