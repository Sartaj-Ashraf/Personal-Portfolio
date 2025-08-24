"use client"
import { useState } from 'react';
export function useDeleteConfirmation() {
    const [deleteItem, setDeleteItem] = useState<any>(null);
  
    const openDeleteDialog = (item: any) => {
      setDeleteItem(item);
    };
  
    const closeDeleteDialog = () => {
      setDeleteItem(null);
    };
  
    return {
      deleteItem,
      openDeleteDialog,
      closeDeleteDialog,
      isOpen: !!deleteItem,
    };
  }