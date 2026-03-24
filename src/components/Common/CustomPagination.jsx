/**
 * Open Bharat Digital Consent by IDfy
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 *
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 *
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

import { Pagination, DropdownButton, Dropdown, Stack } from 'react-bootstrap'
import 'styles/CustomTable.css'

const CustomPagination = ({
  pageSize,
  totalCount,
  handleItemsPerpage,
  currentPage,
  setCurrentPage
}) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  const itemsPerPageOptions = [10, 20, 30, 50, 100]

  const handleItemsPerPageChange = (selectedItemsPerPage) => {
    handleItemsPerpage(selectedItemsPerPage)
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const renderPageNumbers = () => {
    const maxVisiblePages = 5
    const pageNumbers = []

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Pagination.Item
            className='page-numbers'
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        )
      }
    } else {
      const leftEllipsis = currentPage > 2
      const rightEllipsis = currentPage < totalPages - 1

      if (leftEllipsis) {
        pageNumbers.push(
          <Pagination.Ellipsis
            className='page-numbers'
            key='left-ellipsis'
            onClick={() => handlePageChange(currentPage - 1)}
          />
        )
      }

      for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        )
      }

      if (rightEllipsis) {
        pageNumbers.push(
          <Pagination.Ellipsis
            key='right-ellipsis'
            onClick={() => handlePageChange(currentPage + 1)}
          />
        )
      }
    }

    return pageNumbers
  }

  return (
    <Stack direction='horizontal' gap={3}>
      <div className='p-2'>
        <Stack direction='horizontal' className='entries-count'>
          <div className='p-2'>Show entries</div>
          <div className='p-2 dropdown-btn'>
            <DropdownButton
              title={pageSize > totalCount ? totalCount : pageSize}
              id='btn-dropdown-items-per-page'
              onSelect={handleItemsPerPageChange}
            >
              {itemsPerPageOptions.map((option) => (
                <Dropdown.Item key={option} eventKey={option}>
                  {option}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div className='p-2 dropdown-count'>
            <span>of</span>
            {totalCount}
          </div>
        </Stack>
      </div>

      <div className='p-2 ms-auto pagination-container'>
        <Pagination className='custom-pagination'>
          <Pagination.Prev
            id='btn-pagination-prev'
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </Pagination.Prev>

          {renderPageNumbers()}

          <Pagination.Next
            id='btn-pagination-next'
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Pagination.Next>
        </Pagination>
      </div>
    </Stack>
  )
}

export default CustomPagination
