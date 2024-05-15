import React, { createRef } from "react";
import { Files, Tags } from "../model/";
import { FileStructureComponent } from "../pages/filespage/filesystem";
import { Container } from "./container";
import { ExistingThing, ExistingThingDragLess } from "../pages/filespage/thing-existing";
import { Card } from "./card";

export default class FolderViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: props.path || "/",
            sort: "type",
            sort_reverse: true,
            show_hidden: true,
            view: "list",
            is_search: false,
            files: [],
            permissions: null,
            tags: null,
            loading: true,
        };
        this.observers = [];
    }

    componentDidMount() {
        this.onRefresh(this.state.path, "directory");
        // subscriptions
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const new_path = function(path) {
            if (path === undefined) path = "/";
            if (/\/$/.test(path) === false) path = path + "/";
            if (/^\//.test(path) === false) path = "/"+ path;
            return path;
        }((nextProps.match.params.path || "")
            .replace(/%23/g, "#")
            .replace(/%3F/g, "?")
            .replace(/%25/g, "%"));
        if (new_path !== this.state.path) {
            this.setState({ path: new_path, loading: true });
            this.onRefresh(new_path);
        }
    }

    onRefresh(path = this.state.path) {
        console.log("onRefresh");
        console.log(path);
        this.props.reload(path);
        this._cleanupListeners();
        const observer = Files.ls(path, this.state.show_hidden).subscribe((res) => {
            if (res.status !== "ok") {
                return;
            }
            this.setState({
                permissions: res.permissions,
                files: res.results,
                selected: [],
                path: path,
                loading: false,
                is_search: false,
            }, () => {
            });
        }, (error) => this.props.error(error));
        this.observers.push(observer);
        if (path === "/") {
            Promise.all([Files.frequents(), Tags.all()])
                .then(([s, t]) => {
                    this.setState({ frequents: s, tags: t });
                });
        }
    }

    _cleanupListeners() {
        if (this.observers.length > 0) {
            this.observers = this.observers.filter((observer) => {
                observer.unsubscribe();
                return false;
            });
        }
    }

    onFolderPick(path = this.state.path) {
        alert(path);
        // put path in input and move.....
    }

    getParentFolder(path) {
        // Normalize the input path to remove any redundant slashes
        path = path.replace(/\/+/g, '/');
        
        // Check if the path is root (assuming Unix-like root '/')
        if (path === '/') {
            return '/';
        }
    
        // Remove the trailing slash if it exists
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
    
        // Find the last slash in the path
        const lastSlashIndex = path.lastIndexOf('/');
    
        // If no slash is found, it means the path is just a single folder name
        if (lastSlashIndex === -1) {
            return '/';
        }
    
        // Get the parent directory
        const parentFolder = path.slice(0, lastSlashIndex);
    
        // If the parent folder is empty, it means the parent is the root
        return parentFolder === '' ? '/' : parentFolder;
    }

    render() {
        return (
            <div className={"component_filesystem is_folder"}>
                <Container>
                    <div className="component_thing view-list">
                        <div onClick={()=>{this.onRefresh(this.getParentFolder(this.state.path))}} disabled={this.state.path === "/"}>
                            <Card>
                                <span>..</span>
                                <div className="selectionOverlay"></div>
                            </Card>
                        </div>
                    </div>
                    {
                        this.state.files.map((file, index) => {
                            if (file.type === "directory") {
                                return (
                                    <ExistingThingDragLess
                                        onRefresh={this.onRefresh.bind(this)}
                                        onFolderPick={this.onFolderPick.bind(this)}
                                        view={this.state.view}
                                        key={file.name+file.path+(file.icon || "")}
                                        file={file} path={this.state.path}
                                        metadata={{}}
                                        selectableKey={file}
                                        selected={false}
                                        folderviewer={true}
                                        currentSelection={[]} />
                                );
                            }
                            return null;
                        })
                    }
                </Container>
            </div>
        );
    }
}