import React, { useEffect, useState } from "react";

import appStyles from "../../Layout/Layout.module.scss";
import cx from "classnames";

import Tabs from "../../Tabs/Tabs";
import { api } from "../../../services/api";
import CodeBlock from "../../CodeBlock/CodeBlock";

const LeagueScoreboard = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [response, setResponse] = useState(null);

  const [leagueKey, setLeagueKey] = useState(null);
  const [leagueKeyError, setLeagueKeyError] = useState(false);

  const [week, setWeek] = useState(null);

  const [loading, setLoading] = useState(false);

  const makeAPICall = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (null === leagueKey) {
      return setLeagueKeyError(true);
    } else {
      setLeagueKeyError(false);
    }

    setLoading(true);

    const data = await api("/league/scoreboard", {
      leagueKey,
      week,
    });

    setResponse(data);
  };

  useEffect(() => {
    if (response) {
      setLoading(false);
    }
  }, [response]);

  const updateInput = (cb, val) => {
    return cb(val);
  };

  return (
    <>
      <h2 className={cx(appStyles.public, appStyles.private)}>
        league.scoreboard
      </h2>
      <p>
        Subresource to provide data regarding league matchups. Users must be
        authenticated and a member of the league to query against private
        leagues.
      </p>
      <p>Will only work for Head-to-Head style leagues.</p>
      <p>Optional "week" parameter added in v0.4.3</p>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        <h3>{activeTab === "description" ? "Arguments" : "Try It Out"}</h3>
        <form onSubmit={(e) => makeAPICall(e)}>
          <div className={appStyles.table}>
            <div className={cx(appStyles.header, appStyles.row)}>
              <div>Argument</div>
              {activeTab === "tester" && <div>Value</div>}
              <div>Description</div>
            </div>
            <div className={appStyles.row}>
              <div className={cx(appStyles.arg, appStyles.required)}>
                league_key
              </div>
              {activeTab === "tester" && (
                <div>
                  <input
                    className={cx(appStyles.value, {
                      [appStyles.inputErr]: leagueKeyError,
                    })}
                    type="text"
                    onChange={(e) => updateInput(setLeagueKey, e.target.value)}
                  ></input>
                </div>
              )}
              <div>
                The key for the league you'd like to query. League key format:{" "}
                {`{game_key}.l.{league_id}`}
              </div>
            </div>
            <div className={appStyles.row}>
              <div className={cx(appStyles.arg)}>week</div>
              {activeTab === "tester" && (
                <div>
                  <input
                    className={cx(appStyles.value, {
                      [appStyles.inputErr]: leagueKeyError,
                    })}
                    type="text"
                    onChange={(e) => updateInput(setWeek, e.target.value)}
                  ></input>
                </div>
              )}
              <div>
                The week number you'd like the scoreboard for, defaults to the
                current week.
              </div>
            </div>
          </div>

          {activeTab === "tester" && (
            <div className={appStyles.submit}>
              {leagueKeyError && (
                <div className={appStyles.err}>
                  Please enter a value for all required fields
                </div>
              )}
              <button
                onClick={makeAPICall}
                className={appStyles.button}
                type="submit"
              >
                {loading ? (
                  <div className={appStyles.spinner}>
                    <div className={appStyles.bounce1}></div>
                    <div className={appStyles.bounce2}></div>
                    <div className={appStyles.bounce3}></div>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          )}
        </form>

        {response && activeTab === "tester" && <CodeBlock code={response} />}

        {activeTab === "description" && (
          <>
            <div>
              <h3>How to use</h3>
              <CodeBlock>{`const YahooFantasy = require('yahoo-fantasy');
const yf = new YahooFantasy(
  Y!APPLICATION_KEY,
  Y!APPLICATION_SECRET,
  tokenCallbackFn, // optional
  redirectUri // optional
);

yf.setUserToken(
  Y!OAuthAccessToken
);

// promise based
try {
  const scoreboard = yf.league.scoreboard(
    league_key,
    week // optional
  );
} catch (e) {
  // handle error
}

// callback based
yf.league.scoreboard(
  league_key,
  week // optional 
  callbackFn);`}</CodeBlock>
            </div>

            <div className={appStyles.tester}>
              <h3>Sample Response</h3>
              <CodeBlock>
                {JSON.stringify(
                  {
                    league_key: "328.l.34014",
                    league_id: "34014",
                    name: "Freddy Beach Baseball",
                    url: "http://baseball.fantasysports.yahoo.com/b1/34014",
                    draft_status: "postdraft",
                    num_teams: 12,
                    edit_key: "2014-11-23",
                    weekly_deadline: "intraday",
                    league_update_timestamp: "1411979069",
                    scoring_type: "head",
                    league_type: "private",
                    renew: "308_51222",
                    renewed: "",
                    short_invitation_url:
                      "https://yho.com/mlb?l=34014&k=0a2bf56970bb200c",
                    is_pro_league: "0",
                    current_week: "25",
                    start_week: "1",
                    start_date: "2014-03-22",
                    end_week: "25",
                    end_date: "2014-09-28",
                    is_finished: 1,
                    scoreboard: {
                      matchups: [
                        {
                          week: "25",
                          week_start: "2014-09-22",
                          week_end: "2014-09-28",
                          status: "postevent",
                          is_playoffs: "1",
                          is_consolation: "0",
                          is_tied: 0,
                          winner_team_key: "328.l.34014.t.1",
                          teams: [
                            {
                              team_key: "328.l.34014.t.1",
                              team_id: "1",
                              name: "ChicksDigTheLongBall",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/1",
                              team_logo:
                                "http://l.yimg.com/dh/ap/fantasy/img/mlb/icon_6_lg.gif",
                              waiver_priority: 4,
                              number_of_moves: "19",
                              number_of_trades: 0,
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "1",
                                  nickname: "--hidden--",
                                  guid: "RYWP7M53IC626MGOX36ZWCM4FA",
                                  is_commissioner: "1",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "7",
                              },
                              stats: [
                                { stat_id: "60", value: "36/162" },
                                { stat_id: "7", value: "14" },
                                { stat_id: "12", value: "3" },
                                { stat_id: "13", value: "13" },
                                { stat_id: "16", value: "2" },
                                { stat_id: "3", value: ".222" },
                                { stat_id: "50", value: "34.0" },
                                { stat_id: "28", value: "2" },
                                { stat_id: "32", value: "4" },
                                { stat_id: "42", value: "40" },
                                { stat_id: "26", value: "1.06" },
                                { stat_id: "27", value: "0.44" },
                              ],
                            },
                            {
                              team_key: "328.l.34014.t.3",
                              team_id: "3",
                              name: "Human Centipuig",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/3",
                              team_logo:
                                "http://l.yimg.com/dh/ap/fantasy/img/mlb/icon_1_lg.gif",
                              waiver_priority: 2,
                              number_of_moves: "21",
                              number_of_trades: 0,
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "3",
                                  nickname: "--hidden--",
                                  guid: "43VCZ4PSCQWJEKA2UEDRIZ65JQ",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "2",
                              },
                              stats: [
                                { stat_id: "60", value: "26/126" },
                                { stat_id: "7", value: "15" },
                                { stat_id: "12", value: "3" },
                                { stat_id: "13", value: "11" },
                                { stat_id: "16", value: "3" },
                                { stat_id: "3", value: ".206" },
                                { stat_id: "50", value: "16.0" },
                                { stat_id: "28", value: "1" },
                                { stat_id: "32", value: "3" },
                                { stat_id: "42", value: "18" },
                                { stat_id: "26", value: "2.25" },
                                { stat_id: "27", value: "0.88" },
                              ],
                            },
                          ],
                        },
                        {
                          week: "25",
                          week_start: "2014-09-22",
                          week_end: "2014-09-28",
                          status: "postevent",
                          is_playoffs: "1",
                          is_consolation: "0",
                          is_tied: 0,
                          winner_team_key: "328.l.34014.t.2",
                          teams: [
                            {
                              team_key: "328.l.34014.t.2",
                              team_id: "2",
                              name: "SALEBOAT",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/2",
                              team_logo:
                                "https://i.imgur-ysports.com/k9xxNC8y.jpg",
                              waiver_priority: 8,
                              number_of_moves: "30",
                              number_of_trades: "2",
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "2",
                                  nickname: "--hidden--",
                                  guid: "APYOZ4FEZELDRTK3F3FEBYTDPY",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "7",
                              },
                              stats: [
                                { stat_id: "60", value: "47/189" },
                                { stat_id: "7", value: "21" },
                                { stat_id: "12", value: "7" },
                                { stat_id: "13", value: "25" },
                                { stat_id: "16", value: "5" },
                                { stat_id: "3", value: ".249" },
                                { stat_id: "50", value: "48.1" },
                                { stat_id: "28", value: "2" },
                                { stat_id: "32", value: "3" },
                                { stat_id: "42", value: "63" },
                                { stat_id: "26", value: "4.10" },
                                { stat_id: "27", value: "1.20" },
                              ],
                            },
                            {
                              team_key: "328.l.34014.t.7",
                              team_id: "7",
                              name: "TNTNT",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/7",
                              team_logo:
                                "http://l.yimg.com/dh/ap/fantasy/img/mlb/icon_1_lg.gif",
                              waiver_priority: 11,
                              number_of_moves: "31",
                              number_of_trades: "1",
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "7",
                                  nickname: "--hidden--",
                                  guid: "3TORY3MNIUTVTE4LGFNECRT4VA",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "2",
                              },
                              stats: [
                                { stat_id: "60", value: "42/158" },
                                { stat_id: "7", value: "19" },
                                { stat_id: "12", value: "7" },
                                { stat_id: "13", value: "23" },
                                { stat_id: "16", value: "7" },
                                { stat_id: "3", value: ".266" },
                                { stat_id: "50", value: "28.0" },
                                { stat_id: "28", value: "1" },
                                { stat_id: "32", value: "0" },
                                { stat_id: "42", value: "17" },
                                { stat_id: "26", value: "6.75" },
                                { stat_id: "27", value: "1.82" },
                              ],
                            },
                          ],
                        },
                        {
                          week: "25",
                          week_start: "2014-09-22",
                          week_end: "2014-09-28",
                          status: "postevent",
                          is_playoffs: "1",
                          is_consolation: "0",
                          is_tied: 0,
                          winner_team_key: "328.l.34014.t.4",
                          teams: [
                            {
                              team_key: "328.l.34014.t.4",
                              team_id: "4",
                              name: "Jose Abreu",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/4",
                              team_logo:
                                "http://l.yimg.com/dh/ap/fantasy/img/mlb/icon_1_lg.gif",
                              waiver_priority: 10,
                              number_of_moves: "31",
                              number_of_trades: "1",
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "4",
                                  nickname: "--hidden--",
                                  guid: "JAJUZNSZORWFAP7UINDBTUWZ2A",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "6",
                              },
                              stats: [
                                { stat_id: "60", value: "47/176" },
                                { stat_id: "7", value: "25" },
                                { stat_id: "12", value: "8" },
                                { stat_id: "13", value: "18" },
                                { stat_id: "16", value: "3" },
                                { stat_id: "3", value: ".267" },
                                { stat_id: "50", value: "88.0" },
                                { stat_id: "28", value: "5" },
                                { stat_id: "32", value: "4" },
                                { stat_id: "42", value: "94" },
                                { stat_id: "26", value: "2.66" },
                                { stat_id: "27", value: "1.07" },
                              ],
                            },
                            {
                              team_key: "328.l.34014.t.5",
                              team_id: "5",
                              name: "The Beetle Bunch",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/5",
                              team_logo:
                                "http://l.yimg.com/dh/ap/fantasy/img/mlb/icon_11_lg.gif",
                              waiver_priority: 6,
                              number_of_moves: "31",
                              number_of_trades: "1",
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "5",
                                  nickname: "--hidden--",
                                  guid: "FI4ZS2L24CX4SD4F72MTL6O6QE",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "4",
                              },
                              stats: [
                                { stat_id: "60", value: "46/175" },
                                { stat_id: "7", value: "24" },
                                { stat_id: "12", value: "6" },
                                { stat_id: "13", value: "26" },
                                { stat_id: "16", value: "2" },
                                { stat_id: "3", value: ".263" },
                                { stat_id: "50", value: "83.0" },
                                { stat_id: "28", value: "6" },
                                { stat_id: "32", value: "2" },
                                { stat_id: "42", value: "80" },
                                { stat_id: "26", value: "2.06" },
                                { stat_id: "27", value: "1.00" },
                              ],
                            },
                          ],
                        },
                        {
                          week: "25",
                          week_start: "2014-09-22",
                          week_end: "2014-09-28",
                          status: "postevent",
                          is_playoffs: "1",
                          is_consolation: "0",
                          is_tied: 0,
                          winner_team_key: "328.l.34014.t.10",
                          teams: [
                            {
                              team_key: "328.l.34014.t.10",
                              team_id: "10",
                              name: "Jays of Thunder",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/10",
                              team_logo:
                                "http://l.yimg.com/dh/ap/fantasy/img/mlb/icon_4_lg.gif",
                              waiver_priority: 9,
                              number_of_moves: "30",
                              number_of_trades: "3",
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "10",
                                  nickname: "--hidden--",
                                  guid: "5DNOGI6CO6Y6GDZCRICACC6YFE",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "8",
                              },
                              stats: [
                                { stat_id: "60", value: "61/210" },
                                { stat_id: "7", value: "27" },
                                { stat_id: "12", value: "4" },
                                { stat_id: "13", value: "25" },
                                { stat_id: "16", value: "5" },
                                { stat_id: "3", value: ".290" },
                                { stat_id: "50", value: "84.1" },
                                { stat_id: "28", value: "5" },
                                { stat_id: "32", value: "2" },
                                { stat_id: "42", value: "84" },
                                { stat_id: "26", value: "2.35" },
                                { stat_id: "27", value: "1.00" },
                              ],
                            },
                            {
                              team_key: "328.l.34014.t.11",
                              team_id: "11",
                              name: "BaseOnBalls",
                              url:
                                "http://baseball.fantasysports.yahoo.com/b1/34014/11",
                              team_logo:
                                "http://l.yimg.com/dh/ap/fantasy/img/mlb/icon_12_lg.gif",
                              waiver_priority: 1,
                              number_of_moves: "29",
                              number_of_trades: 0,
                              clinched_playoffs: 1,
                              managers: [
                                {
                                  manager_id: "11",
                                  nickname: "--hidden--",
                                  guid: "USBPVWVCNM4RNPGM4ZGZRQS7MQ",
                                },
                              ],
                              points: {
                                coverage_type: "week",
                                week: "25",
                                total: "1",
                              },
                              stats: [
                                { stat_id: "60", value: "47/185" },
                                { stat_id: "7", value: "26" },
                                { stat_id: "12", value: "5" },
                                { stat_id: "13", value: "20" },
                                { stat_id: "16", value: "4" },
                                { stat_id: "3", value: ".254" },
                                { stat_id: "50", value: "44.1" },
                                { stat_id: "28", value: "3" },
                                { stat_id: "32", value: "2" },
                                { stat_id: "42", value: "41" },
                                { stat_id: "26", value: "3.25" },
                                { stat_id: "27", value: "1.08" },
                              ],
                            },
                          ],
                        },
                      ],
                      week: "25",
                    },
                  },
                  null,
                  2
                )}
              </CodeBlock>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LeagueScoreboard;
