// Test script to verify notification system
const API_BASE = "http://localhost:5000/api"

async function testNotifications() {
  console.log("🧪 Testing notification system...")

  try {
    // 1. Login as first user
    console.log("1️⃣ Logging in as first user...")
    const loginResponse1 = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alice@example.com",
        password: "password123",
      }),
    })
    const user1Data = await loginResponse1.json()
    const token1 = user1Data.token
    console.log("✅ User 1 logged in:", user1Data.data.username)

    // 2. Login as second user
    console.log("2️⃣ Logging in as second user...")
    const loginResponse2 = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "bob@example.com",
        password: "password123",
      }),
    })
    const user2Data = await loginResponse2.json()
    const token2 = user2Data.token
    console.log("✅ User 2 logged in:", user2Data.data.username)

    // 3. Get roadmap items
    console.log("3️⃣ Getting roadmap items...")
    const itemsResponse = await fetch(`${API_BASE}/roadmap`)
    const itemsData = await itemsResponse.json()
    const firstItem = itemsData.data.items[0]
    console.log("✅ Got first item:", firstItem.title)

    // 4. User 1 creates a comment
    console.log("4️⃣ User 1 creating comment...")
    const commentResponse = await fetch(`${API_BASE}/comments/item/${firstItem.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        content: "This is a test comment from User 1",
      }),
    })
    const commentData = await commentResponse.json()
    console.log("✅ Comment created:", commentData.data.comment.id)

    // 5. User 2 replies to User 1's comment
    console.log("5️⃣ User 2 replying to comment...")
    const replyResponse = await fetch(`${API_BASE}/comments/item/${firstItem.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token2}`,
      },
      body: JSON.stringify({
        content: "This is a reply from User 2 - should trigger notification!",
        parentId: commentData.data.comment.id,
      }),
    })
    const replyData = await replyResponse.json()
    console.log("✅ Reply created:", replyData.data.comment.id)

    // 6. Check User 1's notifications
    console.log("6️⃣ Checking User 1's notifications...")
    const notificationsResponse = await fetch(`${API_BASE}/notifications`, {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    })
    const notificationsData = await notificationsResponse.json()
    console.log("✅ User 1 notifications:", notificationsData.data.notifications.length)

    if (notificationsData.data.notifications.length > 0) {
      console.log("🔔 Latest notification:", notificationsData.data.notifications[0])
    }

    console.log("🎉 Test completed successfully!")
  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}

testNotifications()
