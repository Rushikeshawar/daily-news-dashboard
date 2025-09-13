 
// src/hooks/usePagination.js
import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updatePagination = (paginationData) => {
    setCurrentPage(paginationData.currentPage || 1);
    setTotalPages(paginationData.totalPages || 1);
    setTotalItems(paginationData.totalItems || 0);
  };

  const resetPagination = () => {
    setCurrentPage(1);
    setTotalPages(1);
    setTotalItems(0);
  };

  return {
    currentPage,
    limit,
    totalPages,
    totalItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    updatePagination,
    resetPagination,
    setLimit
  };
};

