## ⚖️ License & Credits

- **Code:** This project is licensed under the MIT License.
- **Data:** All linguistic data belongs to [OpenRussian.org](https://en.openrussian.org). This project is an independent tool and is not affiliated with OpenRussian.
- **Important:** No database files are included in this repository to respect data provider terms.

## 🛠️ Installation & Setup

1. **Get the Data:**
   - Visit [OpenRussian TogetherDB](https://en.openrussian.org/dictionary).
   - Export `words_forms` and `translations` as CSV.
   
2. **Prepare the Database:**
   - Open **DB Browser for SQLite**.
   - Create a new database named `dictionary.db` inside the `/php` folder.
   - Import the downloaded CSVs as tables.
   
3. **Configure PHP:**
   - Ensure your `get_translations.php` and `get_word.php` points to the correct database filename.
