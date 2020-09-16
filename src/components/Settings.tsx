import React, { useState } from 'react';
import { Dialog, Classes, Switch, Alignment, NumericInput, H4, Label, Button } from '@blueprintjs/core';
import styled from '@emotion/styled';
import Toaster from './Toaster';

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

const defaultState = () => JSON.parse(sessionStorage.getItem('settings') as string) || {
    maxNum: undefined,
    minNum: undefined,
    maxStr: undefined,
    minStr: undefined,
}

export default function Settings(props: IProps) {
    let [state, setState] = useState(defaultState);

    let [isOpen, setOpen] = props.useOpen;
    let [darkTheme, toggleDarkTheme] = props.useTheme;
    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;

    function handleSave(e: any) {
        e.preventDefault();
        sessionStorage.setItem('settings', JSON.stringify(state));
        Toaster.show({message: "Saved successfully", intent: "success", icon: "floppy-disk"});
        setOpen(false);
    }

    function handleChange(_num: number, str: string, html: any) {
        setState({...state, [html.name]: str});
    }

    function handleCancel() {
        setOpen(false);
        setState(defaultState);
    }

    return (
        <Dialog
            icon="cog"
            title="Settings"
            isOpen={isOpen}
            onClose={handleCancel}
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
                <form>
                    <Item>
                        <Label>
                            Number Max Value
                        </Label>
                        <ItemRight>
                            <NumericInput 
                                placeholder="Unlimited" 
                                onValueChange={handleChange}
                                name="maxNum"
                                value={state.maxNum}
                            />
                        </ItemRight>
                    </Item>
                    <Item>
                        <Label>Number Min Value</Label>
                        <ItemRight>
                            <NumericInput 
                                placeholder="Unlimited" 
                                onValueChange={handleChange}
                                name="minNum"
                                value={state.minNum}
                            />
                        </ItemRight>
                    </Item>
                    <br/>
                    <Item>
                        <Label>String Max Chars</Label>
                        <ItemRight>
                            <NumericInput 
                                placeholder="32" 
                                onValueChange={handleChange}
                                name="maxStr"
                                value={state.maxStr}
                            />
                        </ItemRight>
                    </Item>
                    <Item>
                        <Label>String Min Chars</Label>
                        <ItemRight>
                            <NumericInput 
                                placeholder="0" 
                                min={0} 
                                onValueChange={handleChange}
                                name="minStr"
                                value={state.minStr}
                            />
                        </ItemRight>
                    </Item>
                    <br/>
                    <Item>
                        <ItemRight>
                            <Button 
                                intent="danger" 
                                icon="delete"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            &nbsp;
                            <Button 
                                intent="primary" 
                                icon="floppy-disk"
                                type="submit"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </ItemRight>
                    </Item>
                </form>
            </div>
        </Dialog>
    )
}
