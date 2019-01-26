import React, { Component } from "react";
import logo from "./logo.svg";

import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { createStructuredSelector } from "reselect";
import { makeSelectCurrentUser } from "./selectors";
import Login from "../../pages/public/Login";
import NotFoundPage from "../../pages/public/NotFoundPage";
import IndexPage from "../../pages/";
import Register from "../../pages/public/Register";

const { Header, Footer, Sider, Content } = Layout;

const RestrictedRoute = ({ component: Component, currentUser, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      currentUser ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: {
              from: props.location
            }
          }}
        />
      )
    }
  />
);

class App extends Component {
  render() {
    const { match, currentUser, location } = this.props;

    let redirection = "/p/dummy";
    let loc = (window.location + "").split("://");
    loc = loc[loc.length - 1];
    loc = loc.split("/")[1] + "";
    if (
      loc.indexOf("dummy") === 0 &&
      !(window.location + "").indexOf("localhost:") >= 0
    ) {
      // not on localhost with /p/ prefix
      redirection = "/dummy" + redirection;
    }

    if (
      location.pathname === "" ||
      location.pathname === "/" ||
      location.pathname === "/p" ||
      location.pathname === "/dummy/"
    ) {
      return <Redirect to={redirection} />;
    } else if (currentUser && location.pathname === "/app/login") {
      return <Redirect to={redirection} />;
    }
    return (
      <div>
        <Layout>
          <Header>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px", float: `right` }}
            >
              <Menu.Item key="1" onClick={()=>{
                console.log("1")
              }}>Login</Menu.Item>
              <Menu.Item key="2">Register</Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Content>
              <div style={{ minHeight: `100vh` }}>
                <Switch>
                  <RestrictedRoute
                    path={`${match.url}p`}
                    currentUser={{"":""}}
                    component={IndexPage}
                  />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                  {/* <Route exact path="/signin" component={SignInPage}/>
            <Route exact path="/reset_password" component={ResetPassword}/>
    <Route exact path="/pwd" component={ForgetPassword}/>*/}
                  <Route path="*" component={NotFoundPage} />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({});
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser()
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
