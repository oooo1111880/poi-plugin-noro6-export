import React, { Component } from 'react'
import { Button, TextArea, ButtonGroup, Icon } from "@blueprintjs/core"
import { connect } from 'react-redux'
import { shell } from 'electron'
export const windowMode = false;
const { BrowserWindow } = require('electron').remote;
import './index.css';


const parseShip = (ship) => {
    let tempObj =
    {
        "id": ship.api_ship_id,
        "lv": ship.api_lv,
        "st": ship.api_kyouka,
        "exp": ship.api_exp,
        "ex": ship.api_slot_ex
    }

    if (ship.api_sally_area) {
        tempObj.area = ship.api_sally_area
    }

    return tempObj;
}



const parseEquip = (equip) => {
    let tempObj =
    {
        "id": equip.api_slotitem_id,
        "lv": equip.api_level
    }

    if(equip.api_level == undefined) {
        tempObj.lv = 0;
    }

    return tempObj;
}



const copyToClipboard = (result) => {
    const content = document.createElement('input'),
    text = result;
    document.body.appendChild(content);
    content.value = text;
    content.select();
    document.execCommand('copy');
    document.body.removeChild(content);
}



export const reactClass = connect(state => ({
    ships: state.info.ships,
    equips: state.info.equips
}))(class View extends Component {

    state = { result: "" };

    //艦娘資料輸出(包含未上鎖)
    //另3function程式碼大致相同
    exportShipsAll = () => {
        //讀取資料
        const ships = this.props.ships;
        let result = []
        Object.keys(ships).forEach((key) => {
            const ship = ships[key]
            result.push(parseShip(ship))
        })
        let strResult = JSON.stringify(result)
        this.setState({ strResult })

        //複製到剪貼簿
        copyToClipboard(strResult)

        return result;
    }



    //艦娘資料輸出(不包含未上鎖)
    exportShipsLocked = () => {
        const ships = this.props.ships;
        let result = []
        Object.values(ships)
            .filter(ship => {
                return ship.api_locked == "1"
            }).forEach(ship => {
                result.push(parseShip(ship))
            })

        let strResult = JSON.stringify(result)
        this.setState({ strResult })

        //複製到剪貼簿
        copyToClipboard(strResult)

        return result;
    }



    //裝備資料輸出(包含未上鎖)
    exportEquipsAll = () => {
        const equips = this.props.equips;
        let result = [];

        Object.keys(equips).forEach((key) => {
            const equip = equips[key];
            if (equip) {
                if (equip.api_level === undefined) {
                    result.push({ "id": equip.api_slotitem_id, "lv": 0 });
                } else {
                    result.push({ "id": equip.api_slotitem_id, "lv": equip.api_level });
                }
            }
        });

        let strResult = JSON.stringify(result);
        this.setState({ strResult });

        // 複製到剪貼簿
        copyToClipboard(strResult);

        return result;
    }



    //裝備資料輸出(不包含未上鎖)
    exportEquipsLocked = () => {
        const equips = this.props.equips;
        let result = `[`;
        const len = Object.keys(equips).pop();

        for (let j = 0; j < len; j++) {
            if (equips[j]) {
                const equip = equips[j];
                if (equip.api_locked == "0") {
                    continue;
                }
                if(equip.api_level == undefined) {
                    result += `{"id":${equip.api_slotitem_id},"lv":0},`
                }
                else {
                    result += `{"id":${equip.api_slotitem_id},"lv":${equip.api_level}},`
                }
            }
        }
        if (result.charAt(result.length - 1) == ',') {
            result = result.slice(0, result.length - 1)
        }
        result += `]`

        this.setState({ result })

        copyToClipboard(result)

        return result;
    }



    openNewPage = () => {
        const ships = this.exportShipsAll();
        const equips = this.exportEquipsAll();

        const encodedShips = JSON.stringify(ships);
        const encodedEquips = JSON.stringify(equips);

        const url = `https://noro6.github.io/kc-web#import:{"predeck":{},"ships":${encodedShips},"items":${encodedEquips}}`;

        const newWindow = new BrowserWindow({ show: false });

        newWindow.maximize();
        
        newWindow.loadURL(url);
    }



    copyUrl = () => {
        const ships = this.exportShipsAll();
        const equips = this.exportEquipsAll();

        const encodedShips = JSON.stringify(ships);
        const encodedEquips = JSON.stringify(equips);

        const url = `https://noro6.github.io/kc-web#import:{"predeck":{},"ships":${encodedShips},"items":${encodedEquips}}`;

        copyToClipboard(url);
    }



    render() {
        const result = this.state.result;
        return (
            <div>
                <h2 className="mergin">制空権シミュレータ v2</h2>

                <br />
                <br />
                
                <div className="buttonGroup">
                    <div className="groups">
                        <h4>POI頁面</h4>
                        <Button className="openNewPageButton" onClick={this.openNewPage}>
                            打開制空権計算機
                        </Button>
                    </div>

                    <div className="groups">
                        <h4>可輸出至外部瀏覽器</h4>
                        <Button className="openNewPageButton" onClick={this.copyUrl}>
                            複製輸出連結
                        </Button>
                    </div>
                </div>

                <br />
                <br />

                <div>
                    <h4 className="mergin">個別資料選用</h4>
                    
                    <div>
                        <Button className="customButton" onClick={this.exportShipsAll}>
                            艦娘 : 未ロックも含める
                        </Button>
                        
                        <Button className="customButton" onClick={this.exportShipsLocked}>
                            艦娘 : ロック済みのみ&nbsp;&nbsp;&nbsp;
                        </Button>
                    </div>
                    
                    <br />

                    <div>
                        <Button className="customButton" onClick={this.exportEquipsAll}>
                            裝備 : 未ロックも含める
                        </Button>

                        <Button className="customButton" onClick={this.exportEquipsLocked}>
                            裝備 : ロック済みのみ&nbsp;&nbsp;&nbsp;
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
})