import re
from pathlib import Path

from nbconvert.exporters import HTMLExporter
from nbconvert.preprocessors.base import Preprocessor
from traitlets.config import Config


HEADINGS_RENAMED_FIELD = "headings_renamed"


class NumberedHeadingsPreprocessor(Preprocessor):
    """Pre-processor that will rewrite markdown headings to include numberings.
    Store renamed headings in the resources.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_numbering = [0]

    def format_numbering(self):
        """Return a string representation of the current numbering"""
        return ".".join(str(n) for n in self.current_numbering)

    def inc_current_numbering(self, level):
        if level > len(self.current_numbering):
            self.current_numbering = self.current_numbering + [0] * (
                level - len(self.current_numbering)
            )
        elif level < len(self.current_numbering):
            self.current_numbering = self.current_numbering[:level]
        self.current_numbering[level - 1] += 1

    def transform_markdown_line(self, line, resources):
        if m := re.match(r"^(?P<level>#+) (?P<heading>.*)", line):
            level = len(m.group("level"))
            self.inc_current_numbering(level)
            old_heading = m.group("heading").strip()
            new_heading = self.format_numbering() + " " + old_heading
            resources[HEADINGS_RENAMED_FIELD][old_heading] = new_heading
            return "#" * level + " " + new_heading
        else:
            return line

    def preprocess_cell(self, cell, resources, index):
        if cell["cell_type"] == "markdown":
            cell["source"] = "\n".join(
                self.transform_markdown_line(line, resources)
                for line in cell["source"].splitlines()
            )

        return cell, resources

    def preprocess(self, nb, resources):  # noqa GG102
        """Override pre-process to initialize the renamed headings association."""
        resources[HEADINGS_RENAMED_FIELD] = {}
        return super().preprocess(nb, resources)

