export class Product {
   public produs_id: string;
   public nume: string;
   public model: string;
   public dimensiuni: string;
   public description?: string;
   
   constructor ( produs_id: string) {
       this.produs_id = produs_id;
   }
}