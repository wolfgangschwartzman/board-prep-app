require "rexml/document"
require "json"
require "open3"
require "date"

source = ARGV[0] || "/Users/wolfs/Downloads/BOARD PREP CALENDAR.xlsx"
target = File.expand_path("data.js", __dir__)

shared_xml, = Open3.capture2("unzip", "-p", source, "xl/sharedStrings.xml")
shared = []
shared_doc = REXML::Document.new(shared_xml)

REXML::XPath.each(shared_doc, "//xmlns:si") do |si|
  text = +""
  REXML::XPath.each(si, ".//xmlns:t") { |node| text << node.text.to_s }
  shared << text
end

sheet_xml, = Open3.capture2("unzip", "-p", source, "xl/worksheets/sheet2.xml")
sheet_doc = REXML::Document.new(sheet_xml)
headers = []
rows = []

REXML::XPath.each(sheet_doc, "//xmlns:sheetData/xmlns:row") do |row|
  cells = {}

  row.elements.each("xmlns:c") do |cell|
    ref = cell.attributes["r"]
    col = ref[/[A-Z]+/]
    type = cell.attributes["t"]
    raw = cell.elements["xmlns:v"]&.text
    value = type == "s" && raw ? shared[raw.to_i] : raw
    cells[col] = value
  end

  if row.attributes["r"] == "1"
    headers = ("A".."K").map { |col| cells[col] }
    next
  end

  next if cells.empty?

  values = ("A".."K").map { |col| cells[col] }
  sheet_row = headers.zip(values).to_h
  serial = sheet_row["Date"].to_i
  date = Date.new(1899, 12, 30) + serial

  rows << {
    date: date.iso8601,
    day: sheet_row["Day"],
    week: sheet_row["Week"].to_i,
    phase: sheet_row["Phase"],
    system: sheet_row["System Focus"],
    type: sheet_row["Type"],
    obligations: sheet_row["Fixed obligations / school"],
    qbankPlan: sheet_row["Qbank plan"],
    contentFocus: sheet_row["Content focus"],
    notes: sheet_row["Notes / evening"],
  }
end

File.write(target, "window.BOARDS_BLUEPRINT_DATA = #{JSON.pretty_generate(rows)};\n")
puts "Updated #{target} from #{source}"
