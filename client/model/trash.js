import { useState, useEffect } from "react";
import { cache, currentShare, currentBackend } from "../helpers/";
import { Files } from "./files";

const TrashManager = () => {
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState([]);
    const [path, setPath] = useState("/.trash");
    const [observers, setObservers] = useState([]);

    useEffect(() => {
        const obs = Files.ls(path, true, true);
        setObservers([obs]);

        obs.subscribe((files) => {
            if (files === null) {
                return;
            }
            else if (files.results){
                setFiles(files.results);
            }
        });

        return () => {
            observers.forEach((observer) => {
                observer.unsubscribe();
            });
        };
    }, [path]);

    const updFiles = (newFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const _tagPathStringToArray = (tagPathString) => {
        return tagPathString.split("/").filter((r) => r !== "");
    };

    const fetchExtraData = (DB) => {
        if (
            JSON.stringify(Object.keys(DB)) !==
            JSON.stringify(["tags", "share", "backend"])
        ) {
            return Promise.reject(new Error("Not Valid"));
        }
        return cache.upsert(cache.FILE_TAG, [currentBackend(), currentShare()], () => {
            return DB;
        });
    };

    const getExtraData = () => {
        // Add your implementation here
    };

    return {
        files,
        selected,
        path,
        observers,
        updFiles,
        _tagPathStringToArray,
        fetchExtraData,
        getExtraData,
    };
};

export {TrashManager};
