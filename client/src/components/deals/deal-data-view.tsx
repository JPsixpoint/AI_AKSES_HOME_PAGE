import React, { useState, useMemo } from 'react';
import { Deal } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { XIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DealDataViewProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DealDataView({ deal, isOpen, onClose }: DealDataViewProps) {
  if (!isOpen || !deal) return null;
  
  // Parse JSON fields
  const updates = typeof deal.updates === 'string' 
    ? JSON.parse(deal.updates) 
    : deal.updates || [];
    
  const preScreening = typeof deal.preScreening === 'string' 
    ? JSON.parse(deal.preScreening) 
    : deal.preScreening || {};
    
  const members = typeof deal.members === 'string' 
    ? JSON.parse(deal.members) 
    : deal.members || [];
    
  const aiScreening = typeof deal.aiScreening === 'string' 
    ? JSON.parse(deal.aiScreening) 
    : deal.aiScreening || [];
  
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    <div className="fixed inset-0 z-50 bg-background/80 flex items-start justify-center overflow-y-auto">
      <div className="w-full max-w-7xl p-4 h-[calc(100vh-2rem)] mt-4 overflow-hidden flex flex-col bg-background border rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {deal.name}
              <Badge variant={deal.priority === 'High' ? 'destructive' : 'outline'}>
                {deal.priority}
              </Badge>
            </h2>
            <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
              <span>{deal.country}</span>
              <span>•</span>
              <span>{deal.creditHub}</span>
              <span>•</span>
              <span>{deal.stage}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 overflow-y-auto">
          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                    <span className="font-medium">{deal.creditHub || '-'}</span>
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
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Updates ({updates.length})</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[50vh] overflow-y-auto pr-2">
                <div className="space-y-4">
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
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Pre-Screening</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[80vh] overflow-y-auto pr-2">
                {preScreening && Object.keys(preScreening).length > 0 ? (
                  <div className="space-y-6">
                    {preScreening.intro_call && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">Intro Call</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(preScreening.intro_call).map(([key, value]) => {
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
                      </div>
                    )}
                    
                    {Array.isArray(preScreening.product_settings) && preScreening.product_settings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">Product Settings</h4>
                        {preScreening.product_settings.map((product: any, index: number) => {
                          if (Object.values(product).every(v => v === null)) return null;
                          
                          return (
                            <div key={index} className="bg-muted/50 p-4 rounded-md mb-4">
                              <h5 className="text-sm font-medium mb-3">Product {index + 1}</h5>
                              <div className="grid grid-cols-1 gap-2">
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
                          );
                        })}
                      </div>
                    )}
                    
                    {preScreening.sc0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">Screening Completion Status</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(preScreening.sc0).map(([key, value]) => {
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
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No pre-screening data available</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">AI Screening</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[80vh] overflow-y-auto pr-2">
                {aiScreening && aiScreening.length > 0 ? (
                  <div className="space-y-6">
                    {aiScreening.map((screening: any, index: number) => (
                      <div key={index} className="border rounded-md p-4 mb-4">
                        <h4 className="text-sm font-medium mb-3">
                          Screening {index + 1}
                          {screening.timestamp && (
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatDate(new Date(screening.timestamp))}
                            </span>
                          )}
                        </h4>
                        <div className="space-y-4">
                          {Object.entries(screening).map(([key, value]) => {
                            if (key === 'timestamp') return null;
                            
                            const label = key.replace(/_/g, ' ')
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
                            
                            if (typeof value === 'object' && value !== null) {
                              return (
                                <div key={key} className="border rounded-md p-3">
                                  <h5 className="text-sm font-medium mb-2">{label}</h5>
                                  <div className="grid grid-cols-1 gap-2">
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No AI screening data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}