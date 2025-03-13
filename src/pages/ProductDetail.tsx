
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold ml-2">
          Detalii Produs #{productId}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg border p-6">
        <p className="text-lg">Aceasta este pagina de detalii pentru produsul <strong>#{productId}</strong>.</p>
        <p className="mt-4 text-muted-foreground">Ai ajuns aici după ce ai dat click pe un hashtag cu referință la produs.</p>
      </div>
    </div>
  );
};

export default ProductDetail;
