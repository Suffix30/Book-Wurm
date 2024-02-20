# Dynamic PDF Gallery for Book Wurm

This project, hosted in the Book Wurm repository, showcases a dynamic PDF gallery web application designed to display thumbnails of PDF documents in a sidebar. Users can click on these thumbnails to view the corresponding PDF document in a full viewing area. It includes a Node.js build script that automates the generation of the HTML file (`netWork.html`) based on the PDFs and images within specified directories, making it easy to update the gallery with new content.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed before starting:
- [Node.js](https://nodejs.org/) (Recommended version: 14.x or later)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Suffix30/Book-Wurm.git
   ```
2. Navigate to the project directory: 
   ```sh
   cd Book-Wurm
   ```

No further dependency installation is required as the project utilizes standard Node.js libraries.

### Usage

To use the project and generate the `netWork.html` file:

1. Add your PDF files to the `pdfs/` directory and their corresponding thumbnail images to the `images/` directory. Ensure that each PDF file has a matching thumbnail image with the same name.
2. Run the build script to automatically generate the `netWork.html` file, which incorporates the logic to display your PDFs and thumbnails: 
   ```sh
   node build.js
   ```
3. Open `netWork.html` in your web browser to view the dynamic PDF gallery.

### Contributing

Contributions are very welcome! If you have ideas for improvements or new features, please fork this repository, apply your changes, and submit a pull request. We appreciate efforts to refine the code, improve the layout, or extend the functionality.

# Code Overview

This project comprises two main scripts:

1. **netWork.js:** Manages the dynamic display of PDF thumbnails based on categories or search terms, and facilitates the viewing of PDFs in the viewer section.

2. **build.js:** A Node.js script that reads PDF and image files from their respective directories, generates a list of matching thumbnails and PDF paths, and dynamically constructs the `netWork.html` file to include these links.

## License

This project is freely available under the MIT License. For more details, see the `LICENSE` file in the repository.
