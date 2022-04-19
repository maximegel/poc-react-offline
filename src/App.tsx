import "./App.css";
import { InventoryItemsContainer } from "./app/features/inventoryItems/InventoryItemsContainer";
import { ShellContainer } from "./app/features/shell/ShellContainer";

export const App = () => (
  <ShellContainer>
    <InventoryItemsContainer />
  </ShellContainer>
);
