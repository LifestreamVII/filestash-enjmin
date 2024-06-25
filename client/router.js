import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
    NotFoundPage, ConnectPage, HomePage, SharePage, LogoutPage,
    FilesPage, ViewerPage, TagsPage,
} from "./pages/";
import {
    URL_HOME, URL_FILES, URL_VIEWER, URL_LOGIN, URL_LOGOUT,
    URL_ADMIN, URL_SHARE, URL_TAGS,
} from "./helpers/";
import {
    ModalPrompt, ModalAlert, ModalConfirm, Notification, UploadQueue,
    LoadingPage, Sidebar
} from "./components/";


const LazyAdminPage = React.lazy(() => import(/* webpackChunkName: "admin" */"./pages/adminpage"));
const AdminPage = () => (
    <Suspense fallback={<LoadingPage/>}>
        <LazyAdminPage/>
    </Suspense>
);

export default function AppRouter() {
    return (
        <div style={{ height: "100%", display: "flex" }}>
            <BrowserRouter>
                <Sidebar style={{flex: "1"}} />
                <Switch>
                    <Route exact path={URL_HOME} component={HomePage} />
                    <Route path={`${URL_SHARE}/:id*`} component={SharePage} />
                    <Route path={URL_LOGIN} component={ConnectPage} />
                    <Route path={`${URL_FILES}/:path*`} component={FilesPage} />
                    <Route path={`${URL_VIEWER}/:path*`} component={ViewerPage} />
                    <Route path={`${URL_TAGS}/:path*`} component={TagsPage} />
                    <Route path={URL_LOGOUT} component={LogoutPage} />
                    <Route path={URL_ADMIN} component={AdminPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </BrowserRouter>
            <ModalPrompt /> <ModalAlert /> <ModalConfirm />
            <Notification /> <UploadQueue/>
        </div>
    );
}
