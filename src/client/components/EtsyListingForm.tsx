import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ExternalLink, Rocket } from 'lucide-react';

interface EtsyListingFormProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onPublish: () => void;
  isPublishing: boolean;
  publishUrl: string | null;
  hideHeader?: boolean;
}

const EtsyListingForm = ({
  formData,
  onChange,
  onPublish,
  isPublishing,
  publishUrl,
  hideHeader = false
}: EtsyListingFormProps) => {
  return (
    <Card className={`w-full flex flex-col ${hideHeader ? 'rounded-t-none border-t-0' : ''}`}>
      {!hideHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-3 bg-muted/30 border-b border-border/50 h-10">
          <CardTitle className="text-sm">Etsy Listing</CardTitle>
          {publishUrl && (
            <a 
              href={publishUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-[10px] text-orange-500 hover:underline"
            >
              View on Etsy <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </CardHeader>
      )}
      {hideHeader && publishUrl && (
        <div className="px-3 py-1 bg-muted/10 border-b border-border/50 flex justify-end">
          <a 
            href={publishUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-[10px] text-orange-500 hover:underline"
          >
            View on Etsy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
      <CardContent className="p-3 space-y-4">
        {/* About Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider border-b border-border/50 pb-1">About</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="etsy-title" className="text-xs">Title</Label>
              <Input 
                id="etsy-title" 
                value={formData.title || ''} 
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Etsy Listing Title"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="etsy-personalization" className="text-xs">Personalization (optional)</Label>
              <Input 
                id="etsy-personalization" 
                value={formData.personalization || ''} 
                onChange={(e) => onChange('personalization', e.target.value)}
                placeholder="Personalization instructions"
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="etsy-description" className="text-xs">Description</Label>
            <Textarea 
              id="etsy-description" 
              value={formData.description || ''} 
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Item Description"
              className="min-h-[150px] text-xs"
            />
          </div>
        </div>

        {/* Price & Inventory Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider border-b border-border/50 pb-1">Price & Inventory</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="etsy-price" className="text-xs">Price</Label>
              <Input 
                id="etsy-price" 
                type="number" 
                step="0.01"
                value={formData.price || ''} 
                onChange={(e) => onChange('price', e.target.value)}
                placeholder="0.00"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="etsy-quantity" className="text-xs">Quantity</Label>
              <Input 
                id="etsy-quantity" 
                type="number"
                value={formData.quantity || ''} 
                onChange={(e) => onChange('quantity', e.target.value)}
                placeholder="1"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="etsy-sku" className="text-xs">SKU</Label>
              <Input 
                id="etsy-sku" 
                value={formData.sku || ''} 
                onChange={(e) => onChange('sku', e.target.value)}
                placeholder="Unique ID"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider border-b border-border/50 pb-1">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="etsy-category" className="text-xs">Category</Label>
              <Input 
                id="etsy-category" 
                value={formData.category || ''} 
                onChange={(e) => onChange('category', e.target.value)}
                placeholder="e.g. Jewelry"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="etsy-taxonomy-id" className="text-xs">Taxonomy Id</Label>
              <Input 
                id="etsy-taxonomy-id" 
                value={formData.taxonomy_id || ''} 
                onChange={(e) => onChange('taxonomy_id', e.target.value)}
                placeholder="Taxonomy numeric ID"
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="etsy-tags" className="text-xs">Tags (comma separated)</Label>
            <Input 
              id="etsy-tags" 
              value={formData.tags || ''} 
              onChange={(e) => onChange('tags', e.target.value)}
              placeholder="handmade, gift, accessory"
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Other Fields Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider border-b border-border/50 pb-1">Other Fields</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="etsy-who-made" className="text-xs">Who Made</Label>
              <select 
                id="etsy-who-made"
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.who_made || 'i_did'}
                onChange={(e) => onChange('who_made', e.target.value)}
              >
                <option value="i_did">I did</option>
                <option value="collective">A collective</option>
                <option value="someone_else">Someone else</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="etsy-when-made" className="text-xs">When Made</Label>
              <select 
                id="etsy-when-made"
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.when_made || 'made_to_order'}
                onChange={(e) => onChange('when_made', e.target.value)}
              >
                <option value="made_to_order">Made to order</option>
                <option value="recently">Recently (2020-2024)</option>
                <option value="2010_2019">2010-2019</option>
                <option value="vintage">Vintage (before 2005)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="etsy-product-type" className="text-xs">Product Type</Label>
              <select 
                id="etsy-product-type"
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.product_type || 'physical'}
                onChange={(e) => onChange('product_type', e.target.value)}
              >
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="etsy-readiness" className="text-xs">Readiness</Label>
              <select 
                id="etsy-readiness"
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.readiness || 'draft'}
                onChange={(e) => onChange('readiness', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="etsy-shipping-profile" className="text-xs">Shipping Profile</Label>
              <Input 
                id="etsy-shipping-profile" 
                value={formData.shipping_profile || ''} 
                onChange={(e) => onChange('shipping_profile', e.target.value)}
                placeholder="Shipping profile ID/Name"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="etsy-shop-id" className="text-xs">Shop</Label>
              <Input 
                id="etsy-shop-id" 
                value={formData.shop_id === '56358327' ? 'GameBin' : (formData.shop_id || '')} 
                onChange={(e) => {
                  const val = e.target.value;
                  const id = val === 'GameBin' ? '56358327' : val;
                  onChange('shop_id', id);
                }}
                placeholder="Enter Shop ID"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="etsy-is-supply" 
              checked={formData.is_supply || false}
              onCheckedChange={(checked) => onChange('is_supply', checked)}
            />
            <Label htmlFor="etsy-is-supply" className="text-xs">Is Supply / Tool?</Label>
          </div>
        </div>

        <Button 
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-2"
          onClick={onPublish}
          disabled={isPublishing || !formData.shop_id || !formData.title}
        >
          <Rocket className="w-4 h-4" />
          {isPublishing ? 'Publishing to Etsy...' : 'Publish to Etsy'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EtsyListingForm;
