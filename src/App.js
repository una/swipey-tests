import React, { useState } from 'react';
import { SwipeActions } from './SwipeActions';
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

  return (
    <div className="App">
      <h1>Swipe to Delete</h1>
      <div className="list">
        {items.map((item) => (
          <div key={item.id}>
            <SwipeActions.Root>
              <SwipeActions.Trigger className="item-trigger">
                {item.text}
              </SwipeActions.Trigger>
              <SwipeActions.Actions>
                <SwipeActions.Action
                  className="delete-action"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </SwipeActions.Action>
              </SwipeActions.Actions>
            </SwipeActions.Root>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
