import React, { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import TaxonomyPanel from "./TaxonomyPanel";
import { TAXONOMY, TABS } from "../taxonomyConfig";
import styles from "../styles/CategoriesAndTags.module.css";

const CategoriesAndTags = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") === "tags" ? "tags" : "categories";
    const tabRefs = useRef({});

    const selectTab = (tab) => setSearchParams({ tab }, { replace: true });

    const handleKeyDown = (e, index) => {
        let next = null;
        if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
        else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = TABS.length - 1;
        if (next === null) return;

        e.preventDefault();
        const tab = TABS[next];
        selectTab(tab);
        tabRefs.current[tab]?.focus();
    };

    return (
        <div className={styles.page}>
            <main className={styles.inner}>
                <div className={styles.tabs} role="tablist" aria-label="Categories and tags">
                    {TABS.map((tab, index) => {
                        const selected = tab === activeTab;
                        return (
                            <button
                                key={tab}
                                ref={(el) => (tabRefs.current[tab] = el)}
                                type="button"
                                role="tab"
                                id={`tab-${tab}`}
                                aria-selected={selected}
                                aria-controls={selected ? "taxonomy-panel" : undefined}
                                tabIndex={selected ? 0 : -1}
                                className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                                onClick={() => selectTab(tab)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            >
                                {TAXONOMY[tab].label}
                            </button>
                        );
                    })}
                </div>

                <div
                    role="tabpanel"
                    id="taxonomy-panel"
                    aria-labelledby={`tab-${activeTab}`}
                >
                    {/* key remounts the panel on tab switch, so the two lists never mix */}
                    <TaxonomyPanel key={activeTab} config={TAXONOMY[activeTab]} />
                </div>
            </main>
        </div>
    );
};

export default CategoriesAndTags;
