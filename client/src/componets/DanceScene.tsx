import { Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera, 
    SceneLoader, Animation, AnimationGroup } from '@babylonjs/core'
import { AdvancedDynamicTexture, Button, Control, TextBlock } from '@babylonjs/gui'
import { useEffect, useRef } from 'react'
import { useWriteContract, useAccount } from 'wagmi'
import { ABI, CONTRACT_ADDRESS } from '../constants'
import { privateKeyToAccount,Account } from 'viem/accounts'
import "@babylonjs/loaders/glTF";
import { Hex, stringToHex } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../wagmi'
import { liskSepolia } from 'viem/chains'

export function DanceScene() {
    const canvasRef = useRef(null)
    const { address } = useAccount()
    const { writeContract,writeContractAsync, isPending } = useWriteContract()
    
    useEffect(() => {
      if (!canvasRef.current) return
  
      const engine = new Engine(canvasRef.current, true)
      const scene = new Scene(engine)
  
      // Camera setup with adjusted position
      const camera = new ArcRotateCamera(
        'camera',
        0,
        Math.PI / 3,
        25,
        new Vector3(0, 50, 0),
        scene
      )
      camera.attachControl(canvasRef.current, true)
      
      camera.lowerRadiusLimit = 450
      camera.upperRadiusLimit = 550
      
      // Light setup
      new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    // Add action button in the scene
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene)
  
    // Create error message text block
    const errorMessage = new TextBlock()
    errorMessage.text = ""
    errorMessage.color = "red"
    errorMessage.fontSize = 24
    errorMessage.height = "40px"
    errorMessage.top = "-120px" // Position above the dance button
    errorMessage.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    advancedTexture.addControl(errorMessage)

    // Function to show error for 3 seconds
    const showError = (message: string) => {
        errorMessage.text = message
        setTimeout(() => {
        errorMessage.text = ""
        }, 3000)
    }
      // Load character model
      SceneLoader.ImportMeshAsync('', '/model/', 'dance.glb', scene).then(result => {
        const character = result.meshes[0]
        character.position = new Vector3(0, 0, 0)

        // Find the Mixamo animation
        const danceAnimation = result.animationGroups.find(anim => anim.name === "mixamo.com")
        if (danceAnimation) {
          danceAnimation.stop() // Ensure animation is stopped initially
          
          // Optional: Adjust animation speed if needed
          // danceAnimation.speedRatio = 1.0
        } else {
          console.log("Available animations:", result.animationGroups.map(a => a.name))
        }

        let danceTimeout: NodeJS.Timeout | null = null
  
        const performDance = async () => {
            if (!address) return
  
            const dancerAccount = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY as Hex)
  
            try {
              const tx = await writeContractAsync({
                abi: ABI,
                address: CONTRACT_ADDRESS,
                functionName: 'dance',
                args: [address],
                account: dancerAccount,
              })
  
              if (tx) {
                console.log("Transaction:", tx)
             
              }
  
              if (tx && danceAnimation) {
                // Clear existing animation if any
                if (danceTimeout) {
                  clearTimeout(danceTimeout)
                }
  
                // Start the dance animation
                danceAnimation.start(true)
                
                // Stop after 5 seconds
                danceTimeout = setTimeout(() => {
                  danceAnimation.stop()
                }, 5000)
              }
            } catch (error) {
              console.error("Dance transaction failed:", error)

                          // Check for insufficient credits error
            if (error.message.includes("Insufficient credits")) {
                showError("Not enough credits! Buy some credits to dance.")
              } else {
                showError("Failed to dance. Please try again.")
              }
            }
          }

        
        const danceButton = Button.CreateSimpleButton('dance', 'DANCE!')
        danceButton.width = '150px'
        danceButton.height = '40px'
        danceButton.color = 'white'
        danceButton.thickness = 0
        danceButton.cornerRadius = 20
        danceButton.background = 'purple'
        danceButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
        danceButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
        danceButton.top = '-50px'
        
        // Add hover effect
        danceButton.onPointerEnterObservable.add(() => {
          danceButton.background = '#8B008B'
        })
        danceButton.onPointerOutObservable.add(() => {
          danceButton.background = 'purple'
        })
        
        // Add disabled state visual
        if (isPending) {
          danceButton.background = '#B8860B'
          danceButton.isEnabled = false
        }
        
        danceButton.onPointerUpObservable.add(performDance)
        advancedTexture.addControl(danceButton)

        // Log initial state of model and animations
        console.log("Model loaded:", character)
        console.log("Animation groups:", result.animationGroups)
        console.log("Found dance animation:", danceAnimation)

        // Clean up function
        return () => {
          if (danceTimeout) {
            clearTimeout(danceTimeout)
          }
          if (danceAnimation) {
            danceAnimation.stop()
          }
        }
      })
  
      engine.runRenderLoop(() => {
        scene.render()
      })
  
      const handleResize = () => {
        engine.resize()
      }
  
      window.addEventListener('resize', handleResize)
  
      return () => {
        window.removeEventListener('resize', handleResize)
        engine.dispose()
      }
    }, [])
  
    return (
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    )
}