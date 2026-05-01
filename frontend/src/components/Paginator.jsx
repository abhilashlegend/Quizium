import { Pagination } from 'react-bootstrap';

export default function Paginator({total, pageSize, setCurrentPage, currentPage}) {
    const totalPages = Math.ceil(total/pageSize);
    const items = [];

    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination>
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        {items}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Pagination>
    </div>
  );
}