import React, { Component } from 'react'
import { Button, TextArea, ButtonGroup, Icon } from "@blueprintjs/core";
import { connect } from 'react-redux'
import { shell } from 'electron'
export const windowMode = false;
export const reactClass = connect(state => ({
    ships: state.info.ships,
    equips: state.info.equips
}))(class view extends Component {

    state = { result: "" };

    exportShipsAll = () => {
        const ships = this.props.ships;
        const equips = this.props.equips;
        let result = `[`;

        for (let j = 0; j < 1000000; j++) {
            if (ships[j]) {
                const ship = ships[j];
                result += `{"id":${ship.api_ship_id},"lv":${ship.api_lv},"st":[${ship.api_kyouka}],"exp":[${ship.api_exp}],"ex":${ship.api_slot_ex},"area":${ship.api_sally_area}},`;
            }
        }
        if (result.charAt(result.length - 1) == ',') {
            result = result.slice(0, result.length - 1)
        }
        result += `]`
        this.setState({ result })
        
        const content = document.createElement('input'),
        text = result;
        document.body.appendChild(content);
        content.value = text;
        content.select();
        document.execCommand('copy');
        document.body.removeChild(content);
        
        return result;
    }


    
    exportShipsLocked = () => {
        const ships = this.props.ships;
        const equips = this.props.equips;
        let result = `[`;

        for (let j = 0; j < 1000000; j++) {
            if (ships[j]) {
                const ship = ships[j];
                if(ship.api_locked == "0") {
                    continue;
                }
                result += `{"id":${ship.api_ship_id},"lv":${ship.api_lv},"st":[${ship.api_kyouka}],"exp":[${ship.api_exp}],"ex":${ship.api_slot_ex},"area":${ship.api_sally_area}},`;
            }
        }
        if (result.charAt(result.length - 1) == ',') {
            result = result.slice(0, result.length - 1)
        }
        result += `]`
        this.setState({ result })
        
        const content = document.createElement('input'),
        text = result;
        document.body.appendChild(content);
        content.value = text;
        content.select();
        document.execCommand('copy');
        document.body.removeChild(content);
        
        return result;
    }



    exportequipsAll = () => {
        const equips = this.props.equips;
        let result = `[`;

        for (let j = 0; j < 1000000; j++) {
            if (equips[j]) {
                const equip = equips[j];
                result += `{"id":${equip.api_slotitem_id},"lv":${equip.api_level},`
            }
        }
        if (result.charAt(result.length - 1) == ',') {
            result = result.slice(0, result.length - 1)
        }
        result += `]`
        this.setState({ result })
        
        const content = document.createElement('input'),
        text = result;
        document.body.appendChild(content);
        content.value = text;
        content.select();
        document.execCommand('copy');
        document.body.removeChild(content);
        
        return result;
    }



    exportequipsLocked = () => {
        const equips = this.props.equips;
        let result = `[`;

        for (let j = 0; j < 1000000; j++) {
            if (equips[j]) {
                const equip = equips[j];
                if(equip.api_locked == "0") {
                    continue;
                }
                result += `{"id":${equip.api_slotitem_id},"lv":${equip.api_level},`
            }
        }
        if (result.charAt(result.length - 1) == ',') {
            result = result.slice(0, result.length - 1)
        }
        result += `]`
        this.setState({ result })

        const content = document.createElement('input'),
        text = result;
        document.body.appendChild(content);
        content.value = text;
        content.select();
        document.execCommand('copy');
        document.body.removeChild(content);

        return result;
    }



    exportNoro6ShipsAll = () => {
        const result = this.exportShipsAll()
        shell.openExternal(`https://noro6.github.io/kc-web/?predeck=${result}`)
    }

    exportNoro6ShipsLocked = () => {
        const result = this.exportShipsLocked()
        shell.openExternal(`https://noro6.github.io/kc-web/?predeck=${result}`)
    }

    exportNoro6equipsAll = () => {
        const result = this.exportequipsAll()
        shell.openExternal(`https://noro6.github.io/kc-web/?predeck=${result}`)
    }

    exportNoro6equipsLocked = () => {
        const result = this.exportequipsLocked()
        shell.openExternal(`https://noro6.github.io/kc-web/?predeck=${result}`)
    }



    render() {
        const result = this.state.result;
        return (
            <div>
                <h2>艦娘、装備情報</h2>
                <h5>(按下按鈕後可直接至反映貼上)</h5>
                <br/>
                <Button onClick={this.exportShipsAll}>
                    艦娘 : 未ロックも含める
                </Button>
                <br/>
                <br/>
                <Button onClick={this.exportShipsLocked}>
                    艦娘 : ロック済みのみ&nbsp;&nbsp;&nbsp;
                </Button>
                <br/>
                <br/>
                <Button onClick={this.exportequipsAll}>
                    裝備 : 未ロックも含める
                </Button>
                <br/>
                <br/>
                <Button onClick={this.exportequipsLocked}>
                    裝備 : ロック済みのみ&nbsp;&nbsp;&nbsp;
                </Button>
            </div>
        )
    }
})