import React, { Component } from "react";
import { connect } from "react-redux";
import './HomeFooter.scss'

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <p>
          &copy; 2023 Long Nhật{" "}
          <a target="blank" href="https://github.com/HuynhLongNhat">
            More information , please visit my github &#8594;Click here &#8592;
          </a>{" "}
        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
