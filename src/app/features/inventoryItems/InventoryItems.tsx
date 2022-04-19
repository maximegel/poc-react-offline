export const InventoryItems = ({
  items,
  onAdd,
  onRemove,
}: InventoryItemsProps) => (
  <>
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
                onClick={() => onRemove && onRemove(item)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-flex justify-content-end">
      <button className="btn btn-primary" onClick={() => onAdd && onAdd()}>
        Add
      </button>
    </div>
  </>
);

export interface InventoryItemsProps {
  readonly items: InventoryItemsPropsTableRow[];
  readonly onAdd?: () => void;
  readonly onRemove?: (item: InventoryItemsPropsTableRow) => void;
}

export interface InventoryItemsPropsTableRow {
  readonly id: string | number;
  readonly model: string;
  readonly category: string;
}
