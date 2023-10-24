//
//  KopKenWidget.swift
//  KopKenWidget
//
//  Created by Wishnu Hazmi Lazuardi on 24/10/2023.
//


import WidgetKit
import SwiftUI

struct SimpleEntry: TimelineEntry {
    let date: Date
    let imagePath: String
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), imagePath: "")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), imagePath: "")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let userDefaults = UserDefaults(suiteName: "group.com.kopken")
        let imagePath = userDefaults?.string(forKey: "memoryCue") ?? ""
        let entry = SimpleEntry(date: Date(), imagePath: imagePath)
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 1, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct KopKenWidgetEntryView : View {
    var entry: Provider.Entry
  

    var body: some View {
      if let uiImage = UIImage(contentsOfFile: entry.imagePath)?.resized(toWidth: 800) {
            Image(uiImage: uiImage)
                .resizable()
        } else {
          Text("No Image Available: \(entry.imagePath)")
            .containerBackground(for: .widget){
              Color.red
            }
        }
    }
}

struct KopKenWidget: Widget {
    let kind: String = "ImageWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            KopKenWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Image Widget")
        .description("Displays a random image.")
    }
}

struct KopKenWidget_Previews: PreviewProvider {
    static var previews: some View {
        KopKenWidgetEntryView(entry: SimpleEntry(date: Date(), imagePath: ""))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

extension UIImage {
  func resized(toWidth width: CGFloat, isOpaque: Bool = true) -> UIImage? {
    let canvas = CGSize(width: width, height: CGFloat(ceil(width/size.width * size.height)))
    let format = imageRendererFormat
    format.opaque = isOpaque
    return UIGraphicsImageRenderer(size: canvas, format: format).image {
      _ in draw(in: CGRect(origin: .zero, size: canvas))
    }
  }
}
