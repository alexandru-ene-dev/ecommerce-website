import { useEffect, useState } from "react";


const CartFavoritesFeedback = (
  { value, action }: 
  { 
    value: 'Cart' | 'Favorites', 
    action: 'add' | 'remove'
  }
) => {
  const [ feedback, setFeedback ] = useState('');

  useEffect(() => {
    const feedbackMessage = action === 'add' ?
    `Added to ${value}` :
    `Removed from ${value}`;
    setFeedback(feedbackMessage);

    const feedbackItem = document.createElement('li');
    feedbackItem.innerText = feedbackMessage;
  }, [value, action]);


  return (
    <li>{feedback}</li>
  );
};

export default CartFavoritesFeedback;