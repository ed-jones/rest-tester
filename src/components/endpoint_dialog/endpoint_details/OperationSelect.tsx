import React, { useState } from 'react';
import { MultiSelect, IItemRendererProps } from '@blueprintjs/select';
import responses from '@data/Responses';
import { Intent, MenuItem } from '@blueprintjs/core';

interface IProps {
    responses: any,
    handleChange: any,
}

export interface ITag {
    value: number,
    intent: Intent,
    description: string,
}

export default function OperationSelect(props: IProps) {
    let defaultState: { items: ITag[], tags: ITag[] } = {
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
    let [state, setState] = useState(defaultState);

    function arrayContainsTag(tags: ITag[], containsTag: ITag) {
        return tags.filter((tag: ITag) => tag.value === containsTag.value).length > 0;
    }

    function getSelectedTagIndex(item: ITag) {
        return state.tags.map((tag: ITag) => tag.value).indexOf(item.value);
    }

    function isItemSelected(item: ITag) {
        return arrayContainsTag(state.tags, item);
    }

    function handleItemSelect(tag: ITag) {
        if (!isItemSelected(tag)) {
            selectItem([tag]);
        } else {
            deselectItem(getSelectedTagIndex(tag));
        }
    }

    function selectItem(selection: ITag[]) {
        const { items, tags } = state;

        let nextTags = tags.slice();
        let nextItems = items.slice();

        selection.forEach((tag) => {
            nextTags = !arrayContainsTag(nextTags, tag) ? [...nextTags, tag] : nextTags;
        });

        setState({
            tags: nextTags,
            items: nextItems,
        });
        handleChange(nextTags);
    }

    function deselectItem(index: number) {
        const { tags } = state;
        const filteredTags = tags.filter((_tag, i) => i !== index);
        setState({
            tags: filteredTags,
            items: state.items,
        });
        handleChange(filteredTags);
    }

    function handleChange(tags: ITag[]) {
        props.handleChange({
            target: {
                name: "responses",
                type: "tags",
                value: tags.map((tag: ITag) => Number(tag.value)||"default"),
              }
        })
    }

    function getTagIntent(value: number): Intent {
        let intent: Intent = "none";
        if (value < 200) {
            intent = Intent.PRIMARY;
        } else if (value < 300) {
            intent = Intent.SUCCESS;
        } else if (value < 400) {
            intent = Intent.WARNING;
        } else if (isNaN(value)) {
            intent = Intent.NONE;
        } else {
            intent = Intent.DANGER;
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

    function areItemsEqual(itemA: ITag, itemB: ITag) {
        return itemA.value === itemB.value;
    }

    function filterItem(query: string, item: ITag): boolean {
        const normalizedDescription = item.description.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        return `${item.value}: ${normalizedDescription}`.indexOf(normalizedQuery) >= 0;
    }

    return (
        <MultiSelect
            fill
            scrollToActiveItem
            resetOnSelect
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
                    key={item.value}
                />}
            tagInputProps={{
                tagProps: getTagProps,
                onRemove: handleTagRemove,
            }}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemsEqual={areItemsEqual}
            itemPredicate={filterItem}
        />
    )
}
