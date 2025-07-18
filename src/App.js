import React, { useState } from 'react';
import { SwipeActions } from './SwipeActions';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

const initialItems = [
  { id: 1, text: 'Swipe me left' },
  { id: 2, text: 'And me too!' },
  { id: 3, text: 'I am also swipeable' },
  { id: 4, text: 'Another item to swipe' },
  { id: 5, text: 'Last but not least' },
];

function App() {
  const [items, setItems] = useState(initialItems);

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { id: newId, text: `New item ${newId}` }]);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Swipe to Delete</h1>
        <button onClick={handleAdd} className="add-button">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      <div className="list">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              exit={{ opacity: 0.5, x: -100 }}
              transition={{ duration: 0.15 }}
            >
              <SwipeActions.Root onSwipe={() => handleDelete(item.id)}>
                <SwipeActions.Trigger className="item-trigger">
                  {item.text}
                </SwipeActions.Trigger>
              </SwipeActions.Root>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
