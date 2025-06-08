import './Paginator.css'

const Paginator = ({ page, pageSize, onPageChange, onPageSizeChange, totalRecords }) => {
  const totalPages = Math.ceil(totalRecords / pageSize)

  return (
    <div className='paginator'>
      <div className='navigators'>
        <button onClick={() => {
          if (page > 0) onPageChange(page - 1)
        }}>Previous</button>
        <span className="page-info">
          Page {page + 1} of {totalPages || 1}
        </span>
        <button onClick={() => {
          if (page < totalPages - 1) onPageChange(page + 1)
        }}>Next</button>
      </div>
    </div>
  )
}

export default Paginator
