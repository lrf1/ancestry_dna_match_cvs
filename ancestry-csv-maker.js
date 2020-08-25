(async function (minSharedDna, maxSharedDna) {
    const accountID = window.location.href.replace(/\?.*/, "").split(/\//).pop();
    let initPage = 1;
    let skipList = ["Kirsti Frøysaa", "korzen1"];
    let matchCounter = 0;
    var data = "";

    function saveMatches() {
        console.log("Saving data to file...");
        if (typeof data === "object") {
            data = JSON.stringify(data, undefined, 4);
        }
        var blob = new Blob([data], {type: 'text/csv;charset=UTF-8'});
        e = document.createEvent('MouseEvents');
        a = document.createElement('a');
        a.download = "dnamatches.csv";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/csv', a.download, a.href].join(':');
        e.initMouseEvent('click',true,false,window, 0,0,0,0,0,false,false,false,false,0,null);
        a.dispatchEvent(e);
    }

    (function loadPage(page, bookmarkData) {
        console.warn({ page, bookmarkData });

        if (!bookmarkData || bookmarkData.moreMatchesAvailable) {
            $.get(`/discoveryui-matchesservice/api/samples/${accountID}/matches/list?page=${page}&minshareddna=${minSharedDna}&maxshareddna=${maxSharedDna}&sortby=RELATIONSHIP&_t=${Date.now()}${bookmarkData? `&bookmarkdata={%22moreMatchesAvailable%22:true,%22lastMatchesServicePageIdx%22:${bookmarkData.lastMatchesServicePageIdx}}`: ""}`
            )
            .then((resp) => {

                const matches = [];
                for (const group of resp.matchGroups) {
                    for (const match of group.matches) {
                        matches.push(match);
                    }
                }
                console.log(`Added ${matches.length} matches from page ${page} request`);
                
                (function handleMatch(matches) {
                    if (matches.length) {
                        const match = matches.shift(); // Pop match from array front

                        if (!skipList.includes(match.publicDisplayName)) {
                           // Get common matches for this match
                            $.get(`/discoveryui-matchesservice/api/samples/${accountID}/matches/list?page=${page}&relationguid=${match.testGuid}&sortby=RELATIONSHIP&_t=${Date.now()}`
                            )
                            .then((resp) => {
                                matchCounter++;
                                const commonMatches = [];
                                for (const group of resp.matchGroups) {
                                    for (const cmatch of group.matches) {
                                        commonMatches.push(cmatch);
                                    }
                                }
                                let matchString = match.publicDisplayName;
                                if ((match.publicDisplayName).localeCompare(match.adminDisplayName) !== 0) {
                                    matchString += "(Managed by " + match.adminDisplayName + ")";
                                }
                                console.log(matchString + "[" + match.relationship.sharedCentimorgans + "cM] has " + commonMatches.length + " matches.");
                                for (const cmatch of commonMatches) {
                                    if (!skipList.includes(cmatch.publicDisplayName)) {
                                        let commonMatchString = cmatch.publicDisplayName;
                                        if ((cmatch.publicDisplayName).localeCompare(cmatch.adminDisplayName) !== 0) {
                                            commonMatchString += "(Managed by " + cmatch.adminDisplayName + ")";
                                        }
                                        let matchline = matchString +"," + commonMatchString + "\n";
                                        data += matchline;
                                    }
                                }
                                handleMatch(matches);
                            })
                            .fail(() => {
                                matches.unshift(match);
                                console.log("Got error when fetching common matches for " + match.publicDisplayName + "(match # " + matchCounter + "). Retrying in a bit.");
                                setTimeout(() => {
                                    handleMatch(matches);
                                }, Math.floor(Math.random() * 10000) + 10000); // Sleep time 10-20 secs
                            });
                        } else {
                            handleMatch(matches);
                        }

                    } else {
                        loadPage(page + 4, resp.bookmarkData);
                    }
                })(matches);
            })
            .fail(() => {
                console.log("Got error when fetching new page data. Retrying in a bit");
                setTimeout(() => {
                    loadPage(page, bookmarkData);
                }, Math.floor(Math.random() * 10000) + 10000); // Sleep time 10-20 secs
            });
        } else {
            console.log("DONE! Processed " + matchCounter + " matches between " + minSharedDna + " and " + maxSharedDna + " cM.");
            saveMatches();
        }
    })(initPage,  null);

})(200, 3490); // min cM, max cM
