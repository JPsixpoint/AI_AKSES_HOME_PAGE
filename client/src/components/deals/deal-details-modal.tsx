import React, { useState } from 'react';
import { Deal } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DealDetailsModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DealDetailsModal({ deal, isOpen, onClose }: DealDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!deal) return null;
  
  // Parse JSON fields
  const updates = typeof deal.updates === 'string' 
    ? JSON.parse(deal.updates) 
    : deal.updates || [];
    
  const preScreening = typeof deal.pre_screening === 'string' 
    ? JSON.parse(deal.pre_screening) 
    : deal.pre_screening || {};
    
  const members = typeof deal.members === 'string' 
    ? JSON.parse(deal.members) 
    : deal.members || [];
    
  const aiScreening = typeof deal.ai_screening === 'string' 
    ? JSON.parse(deal.ai_screening) 
    : deal.ai_screening || [];
  
  // Helper to format nested objects for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      // Format as currency if it looks like a dollar amount
      if (value > 100) return formatCurrency(value);
      // Format as percentage if it's a decimal < 1
      if (value < 1 && value > 0) return `${(value * 100).toFixed(2)}%`;
      return value.toString();
    }
    if (typeof value === 'string') {
      // Format as date if it looks like a date
      if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
          return formatDate(new Date(value));
        } catch (e) {
          return value;
        }
      }
      return value;
    }
    if (Array.isArray(value)) return `[Array: ${value.length} items]`;
    if (typeof value === 'object') return '[Object]';
    return String(value);
  };

  // Render section with object data
  const renderObjectSection = (data: any, title: string) => {
    if (!data) return null;
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => {
              // Skip rendering objects and arrays inline
              if (typeof value === 'object' && value !== null) return null;
              
              // Format the key as a readable label
              const label = key.replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
                
              return (
                <div key={key} className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="font-medium">{formatValue(value)}</span>
                </div>
              );
            })}
          </div>
          
          {/* Render nested objects */}
          {Object.entries(data).map(([key, value]) => {
            if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
            
            const label = key.replace(/_/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
              
            return (
              <div key={key} className="mt-4">
                <h4 className="text-sm font-medium mb-2">{label}</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(value as object).map(([subKey, subValue]) => {
                      const subLabel = subKey.replace(/_/g, ' ')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                        
                      return (
                        <div key={subKey} className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{subLabel}</span>
                          <span className="font-medium">{formatValue(subValue)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {deal.name}
                <Badge variant={deal.priority === 'High' ? 'destructive' : 'outline'}>
                  {deal.priority}
                </Badge>
              </DialogTitle>
              <DialogDescription className="flex gap-2 mt-1">
                <span>{deal.country}</span>
                <span>•</span>
                <span>{deal.credit_hub}</span>
                <span>•</span>
                <span>{deal.stage}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="updates">Updates ({updates.length})</TabsTrigger>
            <TabsTrigger value="pre-screening">Pre-Screening</TabsTrigger>
            <TabsTrigger value="ai-screening">AI Screening</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="overview" className="m-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">ID</span>
                        <span className="font-medium">{deal.id}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Name</span>
                        <span className="font-medium">{deal.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Lead</span>
                        <span className="font-medium">{deal.lead || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Country</span>
                        <span className="font-medium">{deal.country || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Credit Hub</span>
                        <span className="font-medium">{deal.credit_hub || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Stage</span>
                        <span className="font-medium">{deal.stage || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Priority</span>
                        <span className="font-medium">{deal.priority || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Members</span>
                        <span className="font-medium">{members.length > 0 ? members.join(', ') : '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Latest Update */}
                {updates.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Latest Update</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-l-2 border-primary pl-4">
                        <div className="text-sm mb-1">
                          {updates[0].timestamp && (
                            <span className="text-muted-foreground">
                              {updates[0].timestamp} by {updates[0].created_by || 'Unknown'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm">
                          {updates[0].update ? (
                            <div dangerouslySetInnerHTML={{ __html: updates[0].update }} />
                          ) : (
                            <span>{updates[0]}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="updates" className="m-0">
              <div className="space-y-6">
                {updates.length > 0 ? (
                  updates.map((update: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-4 py-2">
                      <div className="text-sm mb-1">
                        {update.timestamp && (
                          <span className="text-muted-foreground">
                            {update.timestamp} by {update.created_by || 'Unknown'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        {update.update ? (
                          <div dangerouslySetInnerHTML={{ __html: update.update }} />
                        ) : (
                          <span>{update}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No updates available</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pre-screening" className="m-0">
              <div className="space-y-4">
                {preScreening && Object.keys(preScreening).length > 0 ? (
                  <>
                    {/* Render intro call section */}
                    {preScreening.intro_call && renderObjectSection(preScreening.intro_call, 'Intro Call')}
                    
                    {/* Render product settings */}
                    {preScreening.product_settings && (
                      <Card className="mb-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">Product Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {Array.isArray(preScreening.product_settings) ? (
                            <div className="space-y-6">
                              {preScreening.product_settings.map((product: any, index: number) => (
                                <div key={index} className="bg-muted/50 p-4 rounded-md">
                                  <h4 className="text-sm font-medium mb-3">Product {index + 1}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(product).map(([key, value]) => {
                                      if (value === null) return null;
                                      
                                      const label = key.replace(/[0-9]/g, '').replace(/_/g, ' ')
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ');
                                      
                                      return (
                                        <div key={key} className="flex flex-col">
                                          <span className="text-xs text-muted-foreground">{label}</span>
                                          <span className="font-medium">{formatValue(value)}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No product settings available</p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Render other pre-screening sections */}
                    {Object.entries(preScreening).map(([key, value]) => {
                      if (key === 'intro_call' || key === 'product_settings') return null;
                      
                      const title = key.replace(/_/g, ' ')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                      
                      return renderObjectSection(value, title);
                    })}
                  </>
                ) : (
                  <p className="text-muted-foreground">No pre-screening data available</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="ai-screening" className="m-0">
              <div className="space-y-4">
                {aiScreening && aiScreening.length > 0 ? (
                  aiScreening.map((screening: any, index: number) => (
                    <Card key={index} className="mb-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">
                          Screening {index + 1}
                          {screening.timestamp && (
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatDate(new Date(screening.timestamp))}
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                          {Object.entries(screening).map(([key, value]) => {
                            if (key === 'timestamp') return null;
                            
                            const label = key.replace(/_/g, ' ')
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
                            
                            if (typeof value === 'object' && value !== null) {
                              return (
                                <div key={key} className="border rounded-md p-3">
                                  <h4 className="text-sm font-medium mb-2">{label}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(value as object).map(([subKey, subValue]) => {
                                      const subLabel = subKey.replace(/_/g, ' ')
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ');
                                      
                                      return (
                                        <div key={subKey} className="flex flex-col">
                                          <span className="text-xs text-muted-foreground">{subLabel}</span>
                                          <span className="font-medium">{formatValue(subValue)}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={key} className="flex flex-col">
                                <span className="text-xs text-muted-foreground">{label}</span>
                                <span className="font-medium">{formatValue(value)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">No AI screening data available</p>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}