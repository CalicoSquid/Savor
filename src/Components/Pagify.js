
export default function Pagify(props) {

    const {totalPages, currentPage, setCurrentPage} = props.pagifyProps;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
      
      const handlePreviousPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };


    return (
        <div className="pagify">
              <div className="pagify-buttons">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
              </div>             
            </div>
    )
}