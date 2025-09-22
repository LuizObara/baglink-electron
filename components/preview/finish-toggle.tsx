'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface FinishToggleProps {
  id: number;
  currentUser: string;
  linkUser: string;
  onToggle: any;
  initialFinish: boolean;
}

const FinishToggle: React.FC<FinishToggleProps> = ({ id, currentUser, linkUser, initialFinish, onToggle }) => {
  const [finish, setFinish] = useState(initialFinish);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleToggleFinish = async () => {
    if (currentUser !== linkUser) {
      console.error("Apenas o proprietário pode alterar este item.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('items')
        .update({ finish: !finish })
        .eq('id', id)
        .eq('id_user', currentUser);  

      if (error) {
        throw error;
      }

      setFinish(!finish);
      if (onToggle) onToggle();

    } catch (error) {
      console.error('Erro ao atualizar o estado de finish:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="checkbox"
        checked={finish}
        onChange={handleToggleFinish}
        disabled={loading || currentUser !== linkUser}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
      {/* {loading && <span>Atualizando...</span>} */}
    </div>
  );
};

export default FinishToggle;