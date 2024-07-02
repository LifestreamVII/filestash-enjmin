import React, { Suspense, useEffect, useState } from "react";
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
import { Files } from "./model";
import { useLocation } from "react-router-dom/cjs/react-router-dom";


const LazyAdminPage = React.lazy(() => import(/* webpackChunkName: "admin" */"./pages/adminpage"));
const AdminPage = () => (
    <Suspense fallback={<LoadingPage/>}>
        <LazyAdminPage/>
    </Suspense>
);


export default function AppRouter() {

    const [quota, setQuota] = useState({
        quota_size: 100,
        used_quota_size: 0,
    });

    useEffect(() => {
        Files.quota().then((res) => {
            if (res.quota_size)
                setQuota(res);
        });
    }, []);

    return (
        <div style={{ height: "100%", display: "flex" }}>
            <BrowserRouter>
                <Sidebar style={{flex: "1"}} quota={quota}/>
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
