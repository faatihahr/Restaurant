import React from 'react';
import { useNavigate } from 'react-router-dom';
import CartDetailModal from '../components/CartDetailModal';

const CartDetailPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div>
      {/* Empty page background */}
      <CartDetailModal open={true} onOpenChange={(open) => !open && handleClose()}>
        <div></div>
      </CartDetailModal>
    </div>
  );
};

export default CartDetailPage;
