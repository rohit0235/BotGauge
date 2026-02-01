import React, { useState, useMemo, useEffect } from "react";

const ITEMS = {
  fruits: [
    { id: "f1", label: "Apple" },
    { id: "f2", label: "Banana" },
    { id: "f3", label: "Orange" },
    { id: "f4", label: "Mango" },
    { id: "f5", label: "Pineapple" },
    { id: "f6", label: "Strawberry" },
    { id: "f7", label: "Watermelon" },
    { id: "f8", label: "Grape" }
  ],
  vegetables: [
    { id: "v1", label: "Carrot" },
    { id: "v2", label: "Broccoli" },
    { id: "v3", label: "Spinach" },
    { id: "v4", label: "Potato" },
    { id: "v5", label: "Tomato" },
    { id: "v6", label: "Cucumber" },
    { id: "v7", label: "Eggplant" },
    { id: "v8", label: "Bell Pepper" }
  ]
};

const MultiSelectModal = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("vegetables");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState({
    fruits: new Set(),
    vegetables: new Set()
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredItems = useMemo(() => {
    const currentCategoryItems = ITEMS[activeTab];
    if (!debouncedQuery) return currentCategoryItems;
    return currentCategoryItems.filter((item) =>
      item.label.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [activeTab, debouncedQuery]);



  const handleSelectAll = () => {
    const allFilteredIds = filteredItems.map((item) => item.id);
    setSelectedIds((prev) => {
      const newSet = new Set(prev[activeTab]);
      const allFilteredSelected = filteredItems.every((item) => newSet.has(item.id));

      if (allFilteredSelected) {
        filteredItems.forEach((item) => newSet.delete(item.id));
      } else {
        allFilteredIds.forEach((id) => newSet.add(id));
      }

      return { ...prev, [activeTab]: newSet };
    });
  };


  if (!isOpen) return null;

  const totalSelectedCount = selectedIds.fruits.size + selectedIds.vegetables.size;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <header style={styles.header}>
          <div style={styles.headerTop}>
            <h2 style={{ margin: 0 }}>Add Items</h2>
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
          <div style={styles.tabs}>
            {Object.keys(ITEMS).map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.tab,
                  borderBottom: activeTab === cat ? "2px solid #007bff" : "none",
                  color: activeTab === cat ? "#007bff" : "#666"
                }}
                onClick={() => {
                  setActiveTab(cat);
                  setSearchQuery("");
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} ({selectedIds[cat].size})
              </button>
            ))}
          </div>
        </header>

        <main style={styles.content}>
          <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>
            Select {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          
          <input
            type="text"
            placeholder="Search items..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div style={styles.selectAllRow}>
            <label style={styles.label}>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  filteredItems.length > 0 &&
                  filteredItems.every((item) => selectedIds[activeTab].has(item.id))
                }
              />
              <span style={{ marginLeft: "8px", fontWeight: "bold" }}>Select All (Filtered)</span>
            </label>
          </div>

          <div style={styles.scrollArea}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      checked={selectedIds[activeTab].has(item.id)}
                      onChange={() => handleToggle(item.id)}
                    />
                    <span style={{ marginLeft: "8px" }}>{item.label}</span>
                  </label>
                </div>
              ))
            ) : (
              <p style={styles.empty}>No items found.</p>
            )}
          </div>
        </main>

        <footer style={styles.footer}>
          <button style={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button 
            style={{
              ...styles.btnSave,
              backgroundColor: totalSelectedCount === 0 ? "#ccc" : "#007bff",
              cursor: totalSelectedCount === 0 ? "not-allowed" : "pointer"
            }} 
            onClick={handleSave} 
            disabled={totalSelectedCount === 0}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (data) => {
    console.log("Selected Items:", data);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>React Modal Assignment</h1>
      <button 
        onClick={() => setModalOpen(true)}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Open Selection Modal
      </button>

      <MultiSelectModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSave}
      />
    </div>
  );
}
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dimmer background to focus on modal
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)" // Modern glass effect for the background
  },
  modal: {
    backgroundColor: "#ffffff",
    width: "420px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    maxHeight: "85vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  header: {
    padding: "20px 20px 10px 20px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #f0f0f0"
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    color: "#999",
    cursor: "pointer",
    padding: "5px"
  },
  tabs: {
    display: "flex",
    gap: "24px"
  },
  tab: {
    background: "none",
    border: "none",
    padding: "8px 0",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease"
  },
  content: {
    padding: "20px",
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafafa" // Slightly off-white for content contrast
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "15px",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#ffffff"
  },
  selectAllRow: {
    padding: "5px 0 12px 0",
    borderBottom: "1px solid #eee"
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    marginTop: "10px",
    minHeight: "250px",
    paddingRight: "5px"
  },
  itemRow: {
    padding: "10px 0",
    borderBottom: "1px solid #f5f5f5"
  },
  label: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "15px",
    color: "#333"
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: "40px",
    fontSize: "14px"
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    backgroundColor: "#ffffff"
  },
  btnCancel: {
    padding: "10px 18px",
    border: "1px solid #e0e0e0",
    background: "#ffffff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#666"
  },
  btnSave: {
    padding: "10px 22px",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s ease"
  }
};
