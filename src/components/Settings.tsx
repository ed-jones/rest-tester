import React from 'react';
import { Dialog, Classes, Switch, Alignment, NumericInput, H4, Label, Button } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { group } from 'console';

interface IProps {
    useOpen: [boolean, any],
    useTheme: [boolean, any],
}

const Item = styled.span({
    display:"flex", 
    lineHeight:"30px", 
    alignItems:"center",
});

const ItemRight = styled.span({
    marginLeft:"auto",
});

export default function Settings(props: IProps) {
    let [isOpen, setOpen] = props.useOpen;
    let [darkTheme, toggleDarkTheme] = props.useTheme;
    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;

    return (
        <Dialog
            icon="cog"
            title="Settings"
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            className={rehydratedDarkTheme?Classes.DARK:undefined}
        >
            <div className={Classes.DIALOG_BODY}>
                <H4>Interface</H4>
                <Switch 
                    onClick={toggleDarkTheme}
                    innerLabel="Light"
                    innerLabelChecked="Dark"
                    defaultChecked={darkTheme}
                    
                    label="Theme"
                    alignIndicator={Alignment.RIGHT}
                />
                <br/>
                <H4>Test Parameters</H4>
                <Item>
                    <Label>
                        Number Max Value
                    </Label>
                    <ItemRight>
                        <NumericInput placeholder="Unlimited"/>
                    </ItemRight>
                </Item>
                <Item>
                    <Label>Number Min Value</Label>
                    <ItemRight>
                        <NumericInput placeholder="-Unlimited"/>
                    </ItemRight>
                </Item>
                <br/>
                <Item>
                    <Label>String Max Chars</Label>
                    <ItemRight>
                        <NumericInput defaultValue={32}/>
                    </ItemRight>
                </Item>
                <Item>
                    <Label>String Min Chars</Label>
                    <ItemRight>
                        <NumericInput  defaultValue={0}/>
                    </ItemRight>
                </Item>
                <br/>
                <Item>
                    <ItemRight>
                        <Button intent="danger" icon="delete">Cancel</Button>
                        &nbsp;
                        <Button intent="primary" icon="floppy-disk">Save</Button>
                    </ItemRight>
                </Item>
            </div>
        </Dialog>
    )
}
