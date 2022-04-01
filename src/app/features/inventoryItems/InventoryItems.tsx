import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  inventoryItemActions,
  inventoryItemSelectors,
} from "../../store/inventoryItem";

let counter = 1;

export const InventoryItems = () => {
  const items = useAppSelector(inventoryItemSelectors.selectAll);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(inventoryItemActions.loadMany());
  }, [dispatch]);

  return (
    <div className="container-fluid">
      <h1>Inventory</h1>
      <table className="table w-auto">
        <thead>
          <tr>
            <th className="w-75">Model</th>
            <th className="w-25">Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.model}</td>
              <td>{item.category}</td>
              <td style={{ width: "auto" }}>
                <button
                  className="btn btn-danger"
                  onClick={() => dispatch(inventoryItemActions.remove(item))}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary"
          onClick={() =>
            dispatch(
              inventoryItemActions.add({
                model: "La Sportiva Spire GTX " + counter++,
                category: "Shoes",
              }),
            )
          }
        >
          Add
        </button>
      </div>
    </div>
  );
};
