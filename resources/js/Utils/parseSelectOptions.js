import { Children, isValidElement } from 'react';

export function parseOptions(children) {
    const options = [];
    Children.forEach(children, (child) => {
        if (!isValidElement(child) || child.type !== 'option') return;
        const rawValue = child.props.value !== undefined ? child.props.value : child.props.children;
        options.push({
            value: String(rawValue),
            label: child.props.children,
            disabled: !!child.props.disabled,
            color: child.props.color ?? null,
        });
    });
    return options;
}
