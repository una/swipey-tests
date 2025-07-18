import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { useSnap } from './useSnap';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { mergeRefs } from "react-merge-refs";
import useMotionMeasure from 'react-use-motion-measure';

import './SwipeActions.css'

const SwipeActionsContext = createContext(null);

const useSwipeActionsContext = () => {
    const ctx = useContext(SwipeActionsContext);
    if (!ctx) throw new Error('SwipeActionsContext.Provider is missing');
    return ctx;
};

const Root = ({ className, children }) => {
    const [actionsWidth, setActionsWidth] = useState(0);
    const actionsWrapperInset = 2;

    const handleRef = useRef(null);
    const [triggerMeasureRef, triggerBounds] = useMotionMeasure();

    const constraints = useMemo(() => ({
        right: 0,
        left: -actionsWidth - actionsWrapperInset
    }), [actionsWidth, actionsWrapperInset]);

    const { dragProps, snapTo } = useSnap({
        direction: "x",
        ref: handleRef,
        snapPoints: {
            type: 'constraints-box',
            points: [{ x: 0 }, { x: 1 }],
            unit: 'percent',
        },
        constraints,
        dragElastic: { right: 0.04, left: 0.04 },
        springOptions: {
            bounce: 0.2,
        },
    });

    return (<SwipeActionsContext.Provider value={{
        actionsWidth,
        setActionsWidth,
        triggerRef: mergeRefs([handleRef, triggerMeasureRef]),
        dragProps,
        triggerHeight: triggerBounds.height,
        actionsWrapperInset,
        setOpen: (open) => snapTo(open ? 0 : 1),
    }}>
        <div className={clsx('SwipeActions', className)}>{children}</div>
    </SwipeActionsContext.Provider>);
};

const Trigger = ({ className, children }) => {
    const { dragProps, triggerRef } = useSwipeActionsContext();

    return (<motion.div
        role="button"
        tabIndex={0}
        className={clsx('trigger', className)}
        ref={triggerRef}
        {...dragProps}
    >
        {children}
    </motion.div>);
};

const Actions = ({ className, children, wrapperClassName }) => {
    const { actionsWrapperInset, setOpen, triggerHeight, setActionsWidth } = useSwipeActionsContext();
    const actionsWrapperHeight = useTransform(triggerHeight, v => v - actionsWrapperInset);

    const [actionsMeasureRef, actionsBounds] = useMotionMeasure();
    useMotionValueEvent(actionsBounds.width, 'change', setActionsWidth);

    return (<motion.div
        className={clsx("actions-wrapper", wrapperClassName)}
        style={{
            height: actionsWrapperHeight,
            inset: actionsWrapperInset,
        }}
    >
        <motion.div
            className={clsx('actions', className)}
            ref={actionsMeasureRef}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            {children}
        </motion.div>
    </motion.div>);
};

const Action = ({ className, children, onClick, ...props }) => {
    const { setOpen } = useSwipeActionsContext();
    return (<motion.button
        className={clsx('action', className)}
        onClick={(e) => {
            onClick?.(e);
            if (!e.defaultPrevented) {
                setOpen(false);
                (document.activeElement)?.blur();
            }
        }}
        {...props}
    >
        {children}
    </motion.button>);
};

export const SwipeActions = {
    Root,
    Trigger,
    Actions,
    Action,
};
