
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, MessageSquare, FileText, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface CommandItem {
  id: number;
  product: string;
  productId: string;
  productDetails: string;
  quantity: number;
  price: number;
  vat: number;
  total: number;
  stock: 'disponibil' | 'insuficient' | 'epuizat';
}

const CommandDetail = () => {
  const { commandId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Mock command data
  const commandData = {
    id: commandId,
    number: `54516`,
    date: '13 Mar 2025',
    client: 'CLIENT DEMO',
    clientDetails: 'RO20391234 | București | Registru: J24/75/RON',
    status: 'Nouă',
    totalAmount: '207,27 RON',
    vat: '19%',
    vatAmount: '4,9771 RON',
    deliveryDate: '14 Mar 2025, 10:43',
    createdBy: 'Julia Sisu',
    createdAt: '13 Mar 2025, 10:47:24',
    flow: 'Producție Publicitară',
    items: [
      {
        id: 1,
        product: 'Produs DEMO 1',
        productId: 'PROD123',
        productDetails: '123 | FURNIZOR DEMO | GESTIUNE PRINCIPALĂ | 20 BUC',
        quantity: 1,
        price: 174.18,
        vat: 19,
        total: 174.18,
        stock: 'insuficient'
      }
    ],
    totalItems: 1,
    recurringInfo: 'Comandă recurentă creată pentru comanda #54436',
    valueInfo: 'Comandă cu Valoare 0',
    tags: ['Andrei']
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-iflows-primary border-t-transparent animate-spin"></div>
          <div className="text-lg font-medium">Se încarcă comanda...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">
            Comanda Internă #{commandData.number} din {commandData.date}
          </h1>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <Tabs defaultValue="details">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <TabsList className="px-4 py-1">
              <TabsTrigger value="details" className="data-[state=active]:bg-background">
                <Info className="h-4 w-4 mr-2" />
                Detalii
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-background">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comentarii
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-background">
                <FileText className="h-4 w-4 mr-2" />
                Documente Tipizate
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="details" className="p-0">
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                  <div className="text-base font-medium text-blue-500">{commandData.status}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Client</div>
                  <div className="text-base font-medium">{commandData.client}</div>
                  <div className="text-xs text-muted-foreground mt-1">{commandData.clientDetails}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Flux</div>
                  <div className="text-base">{commandData.flow}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Total</div>
                  <div className="text-lg font-semibold">{commandData.totalAmount}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Livrare</div>
                  <div className="text-base">{commandData.deliveryDate}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">TVA</div>
                  <div className="flex items-center gap-2">
                    <div className="text-base">{commandData.vatAmount}</div>
                    <div className="text-muted-foreground">{commandData.vat}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                Creat: {commandData.createdAt} de {commandData.createdBy}
              </div>
              
              <Separator className="mb-6" />
              
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">#</th>
                      <th className="text-left p-3 text-sm font-medium">Produs</th>
                      <th className="text-center p-3 text-sm font-medium">Bucăți</th>
                      <th className="text-center p-3 text-sm font-medium">Cantitate</th>
                      <th className="text-right p-3 text-sm font-medium">UM</th>
                      <th className="text-right p-3 text-sm font-medium">Preț Unitar fără TVA</th>
                      <th className="text-right p-3 text-sm font-medium">Reducere Inclusă</th>
                      <th className="text-right p-3 text-sm font-medium">Valoare RON</th>
                      <th className="text-right p-3 text-sm font-medium">TVA</th>
                      <th className="text-right p-3 text-sm font-medium">Cotă TVA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commandData.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-3 align-top">{item.id}</td>
                        <td className="p-3 align-top">
                          <div className="font-medium flex items-center gap-2">
                            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                            {item.product}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{item.productDetails}</div>
                          {item.stock === 'insuficient' && (
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Stoc Insuficient
                              </Badge>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center align-top">{item.quantity}</td>
                        <td className="p-3 text-center align-top">1</td>
                        <td className="p-3 text-right align-top">buc</td>
                        <td className="p-3 text-right align-top">174,1845</td>
                        <td className="p-3 text-right align-top">-</td>
                        <td className="p-3 text-right align-top font-medium">{item.price.toFixed(2)}</td>
                        <td className="p-3 text-right align-top">33,09</td>
                        <td className="p-3 text-right align-top">{item.vat}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-slate-50 dark:bg-slate-800/50">
                      <td colSpan={7} className="p-3 text-right font-medium">Subtotal {commandData.vat}</td>
                      <td className="p-3 text-right font-medium">174,18</td>
                      <td className="p-3 text-right font-medium">33,09</td>
                      <td></td>
                    </tr>
                    <tr className="border-t">
                      <td colSpan={7} className="p-3 text-right font-medium">Total Bucăți</td>
                      <td className="p-3 text-right font-medium">1</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Detalii</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{commandData.recurringInfo}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Instrucțiuni</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-8 pt-4 border-t">
                <div>
                  <div className="font-medium mb-2">Opțiuni</div>
                  <div className="text-sm text-muted-foreground">{commandData.valueInfo}</div>
                </div>
                
                <div>
                  <div className="font-medium mb-2">Etichete</div>
                  <div className="flex gap-2">
                    {commandData.tags.map((tag, index) => (
                      <Badge key={index} className="bg-blue-500">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comments">
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nu există comentarii</h3>
                <p className="text-muted-foreground">Adaugă primul comentariu la această comandă</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nu există documente tipizate</h3>
                <p className="text-muted-foreground">Nu au fost generate documente pentru această comandă</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommandDetail;
