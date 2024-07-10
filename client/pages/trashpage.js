import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {
    NgIf, NgShow, Loader, LoggedInOnly, BreadCrumb, Card, Icon,
    Dropdown, DropdownButton, DropdownList, DropdownItem,
} from "../components/";
import { URL_TRASH, URL_FILES, URL_VIEWER, basename, filetype, prompt, notify } from "../helpers/";
import { t } from "../locales/";

import "./trashpage.scss";
import "./filespage.scss";
import "./filespage/thing.scss";
import "./filespage/submenu.scss";
import { TrashManager } from "../model/trash";

export function TrashPageComponent({ match }) {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const path = (match.url.replace(URL_TRASH, "") || "/");

    const {files} = TrashManager();

    useEffect(() => {
    
        if (files && files.length > 0)
            {
                
                console.log(files);
                setLoading(false);
            }
        else 
            setLoading(true);

    }, [files]);

    if(match.url.slice(-1) != "/") {
        return (<Redirect to={match.url + "/"} />);
    }

    const onClickRemoveFile = (file) => {
        // Some Action
        setRefresh(refresh + 1);
    }

    const onClickMoreDropdown = (what) => {
        switch(what) {
        case "import":
            let $input = document.getElementById("import_tags");
            $input.click();
            $input.onchange = () => {
                if($input.files.length === 0) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = function () {
                    let jsonObject = null;
                    try {
                        jsonObject = JSON.parse(reader.result);
                    } catch (err) {
                        notify.send(t("Not Valid"), "error");
                        return;
                    }
                    setLoading(true);
                    // do import action
                };
                reader.readAsText($input.files[0]);
            };
            break;
        case "export":
            // Tags.export().then((db) => {
                const $link = document.getElementById("export_tags");
                $link.href = window.URL.createObjectURL(new Blob([JSON.stringify(null, null, 4)]));
                $link.click();
                window.URL.revokeObjectURL($link.href);
            //}).catch((err) => notify.send(err, "error"));
            break;
        }
    }

    const isAFolder = (_path) => (filetype(_path) === "directory");

    return (
        <div className="component_page_tag">
            <BreadCrumb className="breadcrumb" path={path} baseURL={URL_TRASH} />
            <div className="page_container">
                <div className="scroll-y">
                    <div className="component_submenu">
                        <div className="component_container">
                            <h1>
                                {
                                    path === "/" ? (
                                        <Link to="/">
                                            <Icon name="arrow_left" />home
                                        </Link>
                                    ) : path.split("/").filter((r) => r).map((tag, idx) => (
                                        <React.Fragment key={idx}>#{tag} </React.Fragment>
                                    ))
                                }
                            </h1>
                            <div className="menubar">
                                <Dropdown
                                    className="view"
                                    onChange={onClickMoreDropdown}>
                                    <DropdownButton>
                                        <Icon name="more"/>
                                    </DropdownButton>
                                    <DropdownList>
                                        <DropdownItem name="import">
                                            { t("Import Tags") }
                                        </DropdownItem>
                                        <DropdownItem name="export">
                                            { t("Export Tags") }
                                        </DropdownItem>
                                    </DropdownList>
                                </Dropdown>
                                <form style={{display:"none"}}><input type="file" id="import_tags" /></form>
                                <div style={{display:"none"}}><a id="export_tags" download="tags.json"></a></div>
                            </div>
                        </div>
                    </div>
                    <br style={{clear: "both"}}/>
                    <NgShow className="component_container" cond={!loading}>
                        <NgIf cond={!loading} className="list">
                            <ReactCSSTransitionGroup
                                transitionName="filelist-item" transitionLeave={false}
                                transitionEnter={false} transitionAppear={true}
                                transitionAppearTimeout={200}>
                                {
                                    files && files.map((file, idx) => (
                                        <div className="component_thing view-list" key={idx}>
                                            <Link to={(isAFolder(file.path) ? URL_FILES : URL_VIEWER) + file.path}>
                                                <Card>
                                                    <span className="component_action" style={{float: "right"}} onClick={(e) => { e.preventDefault(); onClickRemoveFile(file)}}>
                                                        <Icon name="close" />
                                                    </span>
                                                    <span><Icon name={filetype(file.OgPath) || "file"} /></span>
                                                    <span className="component_filename">
                                                        <span className="file-details">
                                                            {basename(file.Name)}<br/>
                                                            {file.OgPath && (<i>Original : {file.OgPath}&nbsp;</i>)}<br/>
                                                            {file.TrashedDate && (<p style={{fontSize: "9px"}}>{file.TrashedDate}</p>)}
                                                        </span>
                                                    </span>
                                                </Card>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </ReactCSSTransitionGroup>
                        </NgIf>
                        <NgIf className="error" cond={!!files && files.length === 0}>
                            <p className="empty_image">
                                <Icon name="empty_folder" />
                            </p>
                            <p className="label">{ t("There is nothing here") }</p>
                        </NgIf>
                    </NgShow>
                    <NgIf cond={loading}>
                        <Loader/>
                    </NgIf>
                </div>
            </div>
        </div>
    );
}

export const TrashPage = LoggedInOnly(
    TrashPageComponent,
);
