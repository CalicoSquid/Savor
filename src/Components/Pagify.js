
export default function Pagify(props) {

    const {totalPages, currentPage, setCurrentPage, setPreviousPage, recipesPerPage} = props.pagifyProps;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
          console.log(recipesPerPage)
          setPreviousPage(currentPage)
          setCurrentPage(currentPage + 1);
        }
      };
      
      const handlePreviousPage = () => {
        if (currentPage > 1) {
          console.log(recipesPerPage)
          setPreviousPage(currentPage)
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
                {currentPage} / {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
              </div>             
            </div>
    )
}