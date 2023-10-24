//
//  KopKenWidgetLiveActivity.swift
//  KopKenWidget
//
//  Created by Wishnu Hazmi Lazuardi on 24/10/2023.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct KopKenWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct KopKenWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: KopKenWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension KopKenWidgetAttributes {
    fileprivate static var preview: KopKenWidgetAttributes {
        KopKenWidgetAttributes(name: "World")
    }
}

extension KopKenWidgetAttributes.ContentState {
    fileprivate static var smiley: KopKenWidgetAttributes.ContentState {
        KopKenWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: KopKenWidgetAttributes.ContentState {
         KopKenWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: KopKenWidgetAttributes.preview) {
   KopKenWidgetLiveActivity()
} contentStates: {
    KopKenWidgetAttributes.ContentState.smiley
    KopKenWidgetAttributes.ContentState.starEyes
}
