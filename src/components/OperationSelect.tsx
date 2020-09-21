import React, { useState } from 'react';
import { MultiSelect, IItemRendererProps } from '@blueprintjs/select';
import responses from '../objects/responses';
import { Intent, MenuItem } from '@blueprintjs/core';

interface IProps {
    responses: any,
}

export default function OperationSelect(props: IProps) {
    let defaultState: {items: tag[], tags: tag[]} = {
        items: responses.map((response: any) => (
            {
                value: Number(response.value),
                intent: getTagIntent(Number(response.value)),
                description: String(response.description),
            }
        )),
        tags: Object.values(props.responses).map((response: any, index: number) => (
            { 
                value: Number(Object.keys(props.responses)[index]),
                intent: getTagIntent(Number(Object.keys(props.responses)[index])),
                description: String(response.description),
            }
        )),
    }
    let [state, setState ] = useState(defaultState);

    interface tag {
        value: number,
        intent: Intent,
        description: string,
    }

    function arrayContainsTag(tags: tag[], containsTag: tag) {
        return tags.filter((tag: tag) => tag.value === containsTag.value).length > 0;
    }

    function getSelectedTagIndex(item: tag) {
        return state.tags.map((tag: tag) => tag.value).indexOf(item.value);
    }

    function isItemSelected(item: tag) {
        return arrayContainsTag(state.tags, item);
    }

    function handleItemSelect(tag: tag) {
        if (!isItemSelected(tag)) {
            selectItem([tag]);
        } else {
            deselectItem(getSelectedTagIndex(tag));
        }
    }

    function selectItem(selection: tag[]) {
        const {items, tags} = state;

        let nextTags = tags.slice();
        let nextItems = items.slice();

        selection.forEach((tag) => {
            nextTags = !arrayContainsTag(nextTags, tag) ? [...nextTags, tag] : nextTags;
        });

        setState({
            tags: nextTags,
            items: nextItems,
        });
    }

    function deselectItem(index: number) {
        const { tags } = state;
        const filteredTags = tags.filter((_tag, i) => i !== index);
        setState({
            tags: filteredTags,
            items: state.items,
        });
    }

    function getTagIntent(value: number): Intent {
        let intent: Intent = "none";
        if (value < 200){
            intent=Intent.PRIMARY;
        } else if (value < 300) {
            intent=Intent.SUCCESS;
        } else if (value < 400) {
            intent=Intent.WARNING;
        } else if (isNaN(value)) {
            intent=Intent.NONE;
        } else {
            intent=Intent.DANGER;
        }
        return intent;
    }

    function getTagProps(value: React.ReactNode) {
        let intent = getTagIntent(Number(value));
        return { intent };
    }

    function handleTagRemove(_tag: string, index: number) {
        deselectItem(index);
    }

    return (
        <MultiSelect
            fill
            scrollToActiveItem
            items={state.items}
            selectedItems={state.tags}
            onItemSelect={handleItemSelect}
            tagRenderer={(item: any) => item.value}
            itemRenderer={(item: any, itemProps: IItemRendererProps) => 
                <MenuItem 
                    shouldDismissPopover={false}
                    text={`${item.value}: ${item.description}`}
                    active={itemProps.modifiers.active}
                    onClick={itemProps.handleClick}
                    icon={isItemSelected(item) ? "tick" : "blank"}
                />}
            tagInputProps={{
                tagProps: getTagProps,
                onRemove: handleTagRemove,
            }}
            noResults={<MenuItem disabled={true} text="No results." />}
        />
    )
}
