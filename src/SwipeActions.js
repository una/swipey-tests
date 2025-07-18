import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useSnap } from './useSnap';
import { createContext, useContext, useRef } from 'react';
import clsx from 'clsx';

import './SwipeActions.css'

const SwipeActionsContext = createContext(null);

const useSwipeActionsContext = () => {
    const ctx = useContext(SwipeActionsContext);
    if (!ctx) throw new Error('SwipeActionsContext.Provider is missing');
    return ctx;
};

const Root = ({ className, children, onSwipe }) => {
    const handleRef = useRef(null);
    const constraintsRef = useRef(null);
    const x = useMotionValue(0);
    const { dragProps, snapTo } = useSnap({
        direction: "x",
        ref: handleRef,
        constraints: constraintsRef,
        snapPoints: {
            type: 'constraints-box',
            points: [{ x: 0 }],
            unit: 'percent',
            threshold: 0.5,
        },
        onSnap: (index) => {
            if (index === -1) {
                onSwipe?.();
            }
        },
        dragElastic: { right: 0.04, left: 0.04 },
        springOptions: {
            bounce: 0.2,
        },
        style: { x }
    });

    const swipe = () => {
        animate(x, -150, {
            onComplete: () => {
                onSwipe?.();
            }
        });
    }

    return (<SwipeActionsContext.Provider value={{
        triggerRef: handleRef,
        dragProps,
        setOpen: (open) => snapTo(open ? 0 : 1),
        x,
        swipe
    }}>
        <div className={clsx('SwipeActions', className)} ref={constraintsRef}>
            <Actions />
            {children}
        </div>
    </SwipeActionsContext.Provider>);
};

const Trigger = ({ className, children }) => {
    const { dragProps, triggerRef, x, swipe } = useSwipeActionsContext();

    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            swipe();
        }
    }

    return (<motion.div
        role="button"
        tabIndex={0}
        className={clsx('trigger', className)}
        ref={triggerRef}
        {...dragProps}
        style={{ x }}
        onKeyDown={onKeyDown}
    >
        {children}
    </motion.div>);
};

const Actions = () => {
    const { x } = useSwipeActionsContext();
    const backgroundColor = useTransform(x, [0, -100], ['#fff', '#ff0000']);
    const opacity = useTransform(x, [0, -20], [0, 1]);

    return (
        <motion.div className="actions-wrapper" style={{ backgroundColor }}>
            <motion.div className="actions" style={{ opacity }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </motion.div>
        </motion.div>
    )
}

export const SwipeActions = {
    Root,
    Trigger,
};
